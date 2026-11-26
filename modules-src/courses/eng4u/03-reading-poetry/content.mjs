// ENG4U 03 Reading Poetry. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/03-reading-poetry.md
// Public-domain poems only (Shakespeare, Hopkins, E. Pauline Johnson, Dickinson 1890 text, Rossetti, Tennyson, Keats, Blake,
// Coleridge, Poe, Pope, McCrae, Frost); the line-break sentences, model poems and task examples are original to the course.
// Poem lines are written with "·" between the syllables of a word (the module's syllable key); app.js removes the dots for display.

const S73 = ["That time of year thou mayst in me be·hold", "When yel·low leaves, or none, or few, do hang", "Up·on those boughs which shake a·gainst the cold,",
  "Bare ru·ined choirs, where late the sweet birds sang.", "In me thou see’st the twi·light of such day", "As af·ter sun·set fa·deth in the west,",
  "Which by and by black night doth take a·way,", "Death’s sec·ond self, that seals up all in rest.", "In me thou see’st the glow·ing of such fire",
  "That on the ash·es of his youth doth lie,", "As the death-·bed where·on it must ex·pire,", "Con·sumed with that which it was nour·ished by.",
  "This thou per·ceiv’st, which makes thy love more strong,", "To love that well which thou must leave ere long."];
const REM = ["Re·mem·ber me when I am gone a·way,", "Gone far a·way in·to the si·lent land;", "When you can no more hold me by the hand,",
  "Nor I half turn to go yet turn·ing stay.", "Re·mem·ber me when no more day by day", "You tell me of our fu·ture that you planned:",
  "On·ly re·mem·ber me; you un·der·stand", "It will be late to coun·sel then or pray.", "Yet if you should for·get me for a while",
  "And af·ter·wards re·mem·ber, do not grieve:", "For if the dark·ness and cor·rup·tion leave", "A ves·tige of the thoughts that once I had,",
  "Bet·ter by far you should for·get and smile", "Than that you should re·mem·ber and be sad."];
const passage = (lines) => "<div class='rp-qpass'>" + lines.join("<br>") + "</div>";
const SAY = (k) => " <button type='button' class='btn ghost sm rp-say' data-k='say" + k + "'>Read aloud</button>";
const KEATS = ["When I have fears that I may cease to be", "Before my pen has gleaned my teeming brain,", "Before high-pilèd books, in charactery,",
  "Hold like rich garners the full ripened grain;", "When I behold, upon the night’s starred face,", "Huge cloudy symbols of a high romance,",
  "And think that I may never live to trace", "Their shadows with the magic hand of chance;", "And when I feel, fair creature of an hour,",
  "That I shall never look upon thee more,", "Never have relish in the faery power", "Of unreflecting love—then on the shore",
  "Of the wide world I stand alone, and think", "Till love and fame to nothingness do sink."];
const FROST = ["Nature’s first green is gold,", "Her hardest hue to hold.", "Her early leaf’s a flower;", "But only so an hour.", "Then leaf subsides to leaf.",
  "So Eden sank to grief,", "So dawn goes down to day.", "Nothing gold can stay."];
const MCCRAE = ["In Flanders fields the poppies blow", "Between the crosses, row on row,", "That mark our place; and in the sky", "The larks, still bravely singing, fly",
  "Scarce heard amid the guns below."];
const EAGLE = ["He clasps the crag with crooked hands;", "Close to the sun in lonely lands,", "Ring’d with the azure world, he stands.", "",
  "The wrinkled sea beneath him crawls;", "He watches from his mountain walls,", "And like a thunderbolt he falls."];

// Sound sort hints: 1 "Say it aloud." 2 a narrowing question 3 the answer with its reason
const SH = (q, a) => ["Say it aloud.", q, a];
const SAME = "Same starting consonant, or same vowel?";
const PUNCT = "The highlight is punctuation. What does it make your voice do?";
const IMIT = "Does the word sound like what it means?";
const M_ASSON = "Look at the <em>vowels</em>: m<strong>e</strong>llow, w<strong>e</strong>dding, b<strong>e</strong>lls. Repeated vowel sounds are assonance.";
const M_ONOM = "The word itself imitates the sound: that’s onomatopoeia.";
const M_IRH = "These words <em>fully</em> rhyme inside the line: internal rhyme.";
const M_CAES = "The highlight is the punctuation: a pause in mid-line, called a caesura.";
const hl = (s) => "<b class='rp-hl'>" + s + "</b>";
const src = (s) => " <span class='rp-src'>(" + s + ")</span>";

const MASTER = ["Bare ruined choirs, where late the sweet birds sang (Shakespeare, Sonnet 73)", "Consumed with that which it was nourished by. (Shakespeare, Sonnet 73)",
  "This thou perceiv’st, which makes thy love more strong, / To love that well which thou must leave ere long. (Shakespeare, Sonnet 73)",
  "Yet if you should forget me for a while (Rossetti, “Remember”)", "Glory be to God for dappled things (Hopkins, “Pied Beauty”)",
  "Because I could not stop for Death, / He kindly stopped for me; (Dickinson)", "Blow, blow! / I have wooed you so, (Johnson, “The Song My Paddle Sings”)",
  "And like a thunderbolt he falls. (Tennyson, “The Eagle”)", "Tyger Tyger, burning bright (Blake)"];

export default {
  id:"03-reading-poetry",
  kind:"topic",
  title:"Reading poetry",
  topic:"Reading Poetry",
  readyTopic:"reading poetry",
  hero:{
    headline:"Hear it before you explain it.",
    text:"Poetry is language under pressure: every syllable, sound and line break is chosen. In this module you’ll learn to hear <strong>stress</strong> and <strong>metre</strong>, catch the <strong>sound devices</strong> that shape a line, and read <strong>form</strong>: how a sonnet builds an argument and where it <strong>turns</strong>. By the end, you’ll be able to explain how a poem’s music makes its meaning.",
    fig:{ html:"<div class='hs' id='rp-hero' role='group' aria-label='Sonnet 73, lines 1 to 4, with an animated reading that marks the stressed syllables'></div>", caption:"" },
    marks:[[2, 4, 6, 8, 10], [2, 4, 6, 8, 10], [2, 4, 6, 8, 10], [1, 2, 4, 6, 8, 9, 10]],
    cite:"William Shakespeare, Sonnet 73 (1609), lines 1–4",
    caption:"Same metre, heavier line. Why might that be?",
    again:"Listen again", watch:"Watch again"
  },
  goals:[
    "I can hear and mark the stressed syllables in a line and name its metre (iambic or trochaic; tetrameter or pentameter) and any variation.",
    "I can identify sound devices (alliteration, assonance, internal rhyme, onomatopoeia, caesura) and explain their effect.",
    "I can recognize a Shakespearean sonnet, a Petrarchan sonnet and free verse by structure and rhyme scheme, and find the turn.",
    "I can explain how line breaks and enjambment shape pace and emphasis.",
    "I can explain how a poem’s form and sound create its meaning, writing about the speaker rather than the poet.",
    "I can quote and cite poetry correctly (MLA 9: a slash for line breaks, line numbers in the citation)."
  ],
  start:{
    blocks:[{ title:"Word story: verse", html:"<p><strong><em>Verse</em></strong> comes from Latin <em>versus</em>, “a turning”, from the turning of a plough at the end of a furrow. A line of verse turns back at its end, as the plough does. <em>Prose</em> comes from Latin <em>prosa</em>, “straightforward”: it runs straight on. And the sonnet’s <em>volta</em> is Italian for “turn”. Poetry is the art of turning.</p><p class='tiny muted'>Word stories are short histories; see a dictionary’s etymology for more.</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Figurative language", goal:5,
          prompt:"“Bare ruined choirs, where late the sweet birds sang” describes winter branches. What figure of speech is it?",
          options:[
            { t:"Metaphor: the empty branches are called ruined choir stalls, where birds once sang", ok:true, why:"The branches <em>are</em> choirs: a comparison without <em>like</em> or <em>as</em>." },
            { t:"Simile", why:"There’s no <em>like</em> or <em>as</em>." },
            { t:"Onomatopoeia", why:"No word here imitates a sound." },
            { t:"Literal description", why:"Trees don’t literally have choirs." }],
          hints:["Are branches really choirs?", "A comparison without <em>like</em> or <em>as</em> is…", "A metaphor."] },
        { id:"w2", skill:"Figurative language", goal:5,
          prompt:"In “I have wooed you so, / But never a favour you bestow,” the speaker addresses the wind. Which figure is at work?",
          options:[
            { t:"Personification: the wind is treated like a person being courted", ok:true, why:"Wooing and favours belong to people." },
            { t:"Hyperbole", why:"There’s no exaggeration here." },
            { t:"Simile", why:"No <em>like</em> or <em>as</em>." },
            { t:"Alliteration", why:"Alliteration is about sound; the question asks about the comparison." }],
          hints:["Can wind really be wooed?", "Giving human qualities to non-human things is…", "Personification."] },
        { id:"w3", skill:"Sound devices", goal:2,
          prompt:"Which line uses <strong>alliteration</strong>?",
          options:[
            { t:"“Season of mists and mellow fruitfulness” (Keats)", ok:true, why:"<em>Mists</em> and <em>mellow</em> repeat the <em>m</em> consonant sound." },
            { t:"“Hear the mellow wedding bells” (Poe)", why:"That’s mainly assonance: the short <em>e</em> vowel repeats." },
            { t:"“Once upon a midnight dreary, while I pondered, weak and weary” (Poe)", why:"The highlight there is internal rhyme: <em>dreary</em> and <em>weary</em>." },
            { t:"“To err is human; to forgive, divine” (Pope)", why:"That line is built on a pause (a caesura) and balance, not repeated sounds." }],
          hints:["Look for repeated <em>consonant</em> sounds at the start of nearby words.", "Which line repeats <em>m</em>?", "Keats."] },
        { id:"w4", skill:"Sound devices", goal:2,
          prompt:"Which word is onomatopoeia?",
          options:[
            { t:"murmuring", ok:true, why:"It sounds like the low hum it names." },
            { t:"golden", why:"A colour; it doesn’t imitate a sound." },
            { t:"lonely", why:"A feeling, not a sound." },
            { t:"sun", why:"No sound imitated." }],
          hints:["Which word <em>sounds</em> like its meaning?", "Say each one aloud.", "<em>Murmuring</em>."] },
        { id:"w5", skill:"Syllables and stress", goal:1,
          prompt:"Say “behold” aloud. Which syllable is stressed?",
          options:[
            { t:"The second: be-HOLD", ok:true, why:"We say be-HOLD, not BE-hold." },
            { t:"The first: BE-hold", why:"Try both aloud; BE-hold sounds wrong." },
            { t:"Both equally", why:"English words of two syllables almost always stress one." },
            { t:"Neither", why:"Every word of two or more syllables has a stressed syllable." }],
          hints:["Say it in a sentence: “Behold the sea.”", "Which syllable gets more push?", "be-HOLD."] },
        { id:"w6", skill:"Quoting poetry", goal:6,
          prompt:"How do you show a line break when quoting two lines of a poem inside your own sentence?",
          options:[
            { t:"With a spaced slash: “against the cold, / Bare ruined choirs”", ok:true, why:"MLA marks line breaks in running text with a slash with a space on each side." },
            { t:"With an ellipsis (…)", why:"An ellipsis shows words left out, not a line break." },
            { t:"Start a new paragraph", why:"That’s block format, used only for longer quotations (more than 3 lines)." },
            { t:"You don’t need to show it", why:"Line breaks are part of the poem’s meaning; show them." }],
          hints:["What symbol stands for a line break?", "Not an ellipsis.", "A slash with spaces."] }
      ],
      refreshers:{
        "Figurative language":"A metaphor says one thing <em>is</em> another (the branches <em>are</em> choirs); a simile uses <em>like</em> or <em>as</em>; personification gives human qualities to non-human things.",
        "Sound devices":"Alliteration repeats consonant sounds at the start of nearby words; assonance repeats vowel sounds; internal rhyme rhymes words within a line; onomatopoeia imitates a sound; a caesura is a strong pause inside a line.",
        "Syllables and stress":"Say a word aloud in a sentence. The stressed syllable gets more push and length: be-HOLD, MOR-ning, to-MOR-row.",
        "Quoting poetry":"In your own sentence, mark line breaks with “ / ” and cite line numbers: “against the cold, / Bare ruined choirs” (Shakespeare, lines 3–4)."
      }
    }
  },
  explore:{
    heading:"Sound and shape studio",
    intro:"Listen to a line, then mark what you hear. Tap syllables to stress them, letter the rhymes, find the turn, and break lines to see how white space changes a poem.",
    modes:[{ id:"scan", t:"Listen & scan" }, { id:"rhyme", t:"Rhyme & form" }, { id:"breaks", t:"Line-break lab" }, { id:"lens", t:"Device lens" }],
    lenses:[{ id:"sound", label:"Sound", role:"sound" }, { id:"imagery", label:"Imagery", role:"image" }, { id:"figure", label:"Figure", role:"figure" }, { id:"syntax", label:"Syntax", role:"syntax" }, { id:"diction", label:"Diction", role:"diction" }],
    forms:[{ id:"shakespearean", t:"Shakespearean sonnet" }, { id:"petrarchan", t:"Petrarchan sonnet" }, { id:"curtal", t:"Curtal sonnet" }, { id:"ballad", t:"Ballad stanza" }, { id:"couplets", t:"Couplets" }, { id:"free", t:"Free verse" }],
    poems:[
      { id:"s73", label:"Sonnet 73", by:"Shakespeare", cite:"William Shakespeare, Sonnet 73 (1609)", lines:S73, groups:[4, 4, 4, 2],
        dev:[
          { lens:"sound", at:[[3, "Bare ruined choirs"], [3, "sweet birds sang"]], tag:"spondees", note:"stresses crowd together, so the line drags like a mourner’s step" },
          { lens:"sound", at:[[6, "by and by black"]], label:"by and by black night", tag:"alliteration (b)", note:"the heavy b sounds thud like doors shutting on the day" },
          { lens:"sound", at:[[7, "Death’s second self, that seals"]], label:"second self … seals", tag:"alliteration (s)", note:"soft s sounds hush the line, as sleep and death do" },
          { lens:"imagery", at:[[1, "yellow leaves, or none, or few, do hang"]], label:"yellow leaves … do hang", tag:"visual imagery", note:"a tree almost bare in late autumn: the speaker’s age as a season" },
          { lens:"imagery", at:[[2, "boughs which shake against the cold"]], tag:"tactile imagery", note:"you feel the cold and see the branches tremble" },
          { lens:"imagery", at:[[4, "twilight"], [5, "after sunset fadeth in the west"]], label:"twilight … fadeth in the west", tag:"visual imagery", note:"the last light draining from the sky" },
          { lens:"imagery", at:[[8, "glowing of such fire"]], label:"the glowing of such fire", tag:"visual imagery", note:"embers still warm, but burning down" },
          { lens:"figure", at:[[3, "Bare ruined choirs"]], tag:"metaphor", note:"the branches become empty choir stalls: the song and the singers are gone" },
          { lens:"figure", at:[[6, "black night"], [7, "Death’s second self"]], tag:"metaphor", note:"night is death’s double: each evening rehearses the end" },
          { lens:"figure", at:[[9, "the ashes of his youth"]], tag:"metaphor", note:"youth is fuel already burned; what is left smothers the flame" },
          { lens:"syntax", at:[[1, "leaves, or none, or few,"]], tag:"caesurae", note:"the commas make the speaker hesitate, counting the last leaves" },
          { lens:"syntax", at:[[0, "in me"], [4, "In me thou see’st"], [8, "In me thou see’st"]], tag:"repetition (anaphora)", note:"each quatrain opens the same door into a darker room" },
          { lens:"syntax", at:[[12, "This thou perceiv’st"]], tag:"the turn", note:"the couplet stops describing “me” and speaks to “thou”" },
          { lens:"diction", at:[[3, "ruined"]], tag:"connotation", note:"a word for buildings and lives, not just trees" },
          { lens:"diction", at:[[11, "Consumed"], [11, "nourished"]], tag:"words of eating", note:"the fire is eaten by what once fed it: a paradox" }
        ] },
      { id:"pied", label:"“Pied Beauty”", by:"Hopkins", cite:"Gerard Manley Hopkins, “Pied Beauty” (written 1877, published 1918)",
        lines:["Glo·ry be to God for dap·pled things—", "For skies of cou·ple-·col·our as a brin·ded cow;", "For rose-·moles all in stip·ple up·on trout that swim:",
          "Fresh-·fire·coal chest·nut-·falls; finch·es’ wings;", "Land·scape plot·ted and pieced — fold, fal·low, and plough;", "And all trades, their gear and tack·le and trim.",
          "", "All things coun·ter, o·rig·i·nal, spare, strange;", "What·ev·er is fick·le, freck·led (who knows how?)", "With swift, slow; sweet, sour; a·daz·zle, dim;",
          "He fa·thers-·forth whose beau·ty is past change:", "Praise him."],
        indent:[0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 6], groups:[6, 5],
        note:"Hopkins counted stresses, not syllables (he called it “sprung rhythm”), so the metre readout may never find a regular pattern here. That is the point.",
        dev:[
          { lens:"sound", at:[[3, "Fresh-firecoal chestnut-falls; finches’"]], label:"Fresh-firecoal … finches’", tag:"alliteration (f)", note:"bright, quick f sounds spark like the coals they name" },
          { lens:"sound", at:[[4, "fold, fallow"]], tag:"alliteration (f)", note:"the field’s pattern is stitched together in sound" },
          { lens:"sound", at:[[7, "fickle, freckled"]], tag:"alliteration and consonance", note:"two words almost alike, as dappled things are almost alike" },
          { lens:"imagery", at:[[1, "a brinded cow"]], tag:"visual imagery", note:"a streaked, patchy hide: the plain beauty of the farm" },
          { lens:"imagery", at:[[2, "rose-moles all in stipple upon trout"]], tag:"visual imagery", note:"tiny red dots on a fish: the eye zooms in close" },
          { lens:"imagery", at:[[4, "Landscape plotted and pieced"]], tag:"visual imagery", note:"fields seen from above, like a patchwork quilt" },
          { lens:"figure", at:[[1, "skies of couple-colour as a brinded cow"]], label:"skies … as a brinded cow", tag:"simile", note:"the heavens compared to a cow: high and low share the same dappled beauty" },
          { lens:"figure", at:[[3, "Fresh-firecoal chestnut-falls"]], tag:"metaphor", note:"fallen chestnuts split open like glowing coals" },
          { lens:"syntax", at:[[1, "For"], [2, "For"]], tag:"repetition (a list)", note:"a catalogue of thanks, piling example on example" },
          { lens:"syntax", at:[[8, "swift, slow; sweet, sour; adazzle, dim;"]], label:"swift, slow; sweet, sour; adazzle, dim", tag:"paired opposites", note:"each pair holds a contrast together, the way pied things do" },
          { lens:"syntax", at:[[10, "Praise him."]], tag:"the short last line", note:"all the variety narrows to two words of praise" },
          { lens:"diction", at:[[1, "couple-colour"], [9, "fathers-forth"]], tag:"coined compounds", note:"Hopkins joins words to pack two things into one" }
        ] },
      { id:"paddle", label:"“The Song My Paddle Sings”", by:"Johnson", cite:"E. Pauline Johnson (Tekahionwake), “The Song My Paddle Sings” (1895), opening stanza, as printed in <i>Flint and Feather</i> (1912)",
        lines:["West wind, blow from your prai·rie nest,", "Blow from the moun·tains, blow from the west.", "The sail is i·dle, the sail·or too;", "O! wind of the west, we wait for you.",
          "Blow, blow!", "I have wooed you so,", "But nev·er a fa·vour you be·stow.", "You rock your cra·dle the hills be·tween,", "But scorn to no·tice my white la·teen."],
        groups:[9],
        dev:[
          { lens:"sound", at:[[0, "blow"], [1, "Blow"], [1, "blow"]], tag:"repetition", note:"the command repeats like a paddler’s stroke" },
          { lens:"sound", at:[[0, "West wind"]], tag:"alliteration (w)", note:"the two words of address are bound together, like a name" },
          { lens:"sound", at:[[3, "wind of the west, we wait"]], label:"wind … west, we wait", tag:"alliteration (w)", note:"the soft w sounds breathe like the wind the speaker wants" },
          { lens:"imagery", at:[[0, "prairie nest"], [1, "mountains"]], label:"prairie … mountains", tag:"visual imagery", note:"a whole Canadian landscape the wind could come from" },
          { lens:"imagery", at:[[8, "my white lateen"]], tag:"visual imagery", note:"a small white sail, hanging still" },
          { lens:"figure", at:[[0, "West wind, blow from your prairie nest"]], label:"West wind … your prairie nest", tag:"apostrophe and personification", note:"the speaker calls to the wind as if it could hear, and gives it a nest" },
          { lens:"figure", at:[[5, "I have wooed you so"], [6, "never a favour you bestow"]], label:"wooed … never a favour", tag:"personification", note:"the wind is a reluctant sweetheart, and the wait becomes a courtship" },
          { lens:"figure", at:[[7, "You rock your cradle the hills between"]], label:"You rock your cradle", tag:"personification", note:"the wind is busy elsewhere, tending something else" },
          { lens:"syntax", at:[[4, "Blow, blow!"]], tag:"a two-beat line", note:"the clipped line sounds like an impatient call" },
          { lens:"syntax", at:[[2, "The sail is idle, the sailor too"]], tag:"parallel phrases", note:"boat and person stall together" },
          { lens:"diction", at:[[5, "wooed"], [6, "favour"], [6, "bestow"]], tag:"courtly words", note:"old words of courtship make the waiting playful" }
        ] },
      { id:"death", label:"“Because I could not stop for Death”", by:"Dickinson", cite:"Emily Dickinson, “Because I could not stop for Death”, stanza 1, from <i>Poems</i> (1890), where its editors titled it “The Chariot”",
        lines:["Be·cause I could not stop for Death,", "He kind·ly stopped for me;", "The car·riage held but just our·selves", "And Im·mor·tal·i·ty."],
        indent:[0, 1, 0, 1], groups:[4],
        dev:[
          { lens:"figure", at:[[0, "Death,"], [1, "He kindly stopped for me"]], label:"Death … He kindly stopped", tag:"personification", note:"Death arrives as a polite gentleman caller" },
          { lens:"figure", at:[[3, "Immortality"]], tag:"personification", note:"a third passenger in the carriage: eternity rides along" },
          { lens:"sound", at:[[0, "stop"], [1, "stopped"]], tag:"repetition", note:"she could not stop, so Death did: the echo turns the tables" },
          { lens:"imagery", at:[[2, "The carriage"]], tag:"visual imagery", note:"an ordinary drive, which makes the journey to death feel calm" },
          { lens:"syntax", at:[[0, "Because I could not stop for Death,"], [1, "He kindly stopped for me;"]], label:"lines of 8 and 6 syllables", tag:"hymn metre", note:"the steady rhythm of church hymns, set to a meeting with Death" },
          { lens:"diction", at:[[1, "kindly"]], tag:"connotation", note:"a gentle word for a terrifying visitor: the calm is unsettling" }
        ] },
      { id:"rem", label:"“Remember”", by:"Rossetti", cite:"Christina Rossetti, “Remember” (1862)", lines:REM, groups:[8, 6], indent:[0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1],
        dev:[
          { lens:"syntax", at:[[0, "Remember me"], [4, "Remember me"], [6, "remember me"]], tag:"repetition", note:"the octave keeps returning to the same plea" },
          { lens:"syntax", at:[[8, "Yet"]], tag:"the turn", note:"one word swings the poem from asking to releasing" },
          { lens:"syntax", at:[[12, "forget and smile"], [13, "remember and be sad"]], tag:"antithesis", note:"the closing lines balance two choices and pick the kinder one" },
          { lens:"figure", at:[[1, "the silent land"]], tag:"metaphor", note:"death as a quiet country: far, but not frightening" },
          { lens:"figure", at:[[10, "the darkness and corruption"]], tag:"metaphor", note:"the grave and the body’s decay, named plainly" },
          { lens:"imagery", at:[[2, "hold me by the hand"]], tag:"tactile imagery", note:"love made physical, and about to be lost" },
          { lens:"imagery", at:[[3, "half turn to go yet turning stay"]], tag:"movement imagery", note:"a hesitating body at a doorway, unable to leave" },
          { lens:"sound", at:[[0, "gone away"], [1, "Gone far away"]], label:"gone away, / Gone far away", tag:"echo", note:"the repeated words stretch the distance as you say them" },
          { lens:"diction", at:[[11, "vestige"]], tag:"precise word", note:"a formal word for a faint trace: even a little memory is too much pain" }
        ] }
    ],
    passageChip:"Line-break passage",
    keys:[
      { id:"s73:0", answer:{ req:[2, 4, 6, 10], opt:[8], never:[1, 3, 5, 7, 9] } },
      { id:"s73:3", answer:{ req:[2, 4, 6, 8, 10], opt:[1, 9], never:[3, 5, 7] } },
      { id:"s73:12", answer:{ req:[4, 6, 8, 10], opt:[1, 2], never:[3, 5, 7, 9] } },
      { id:"rem:0", answer:{ req:[2, 4, 8, 10], opt:[6], never:[1, 3, 5, 7, 9] } },
      { id:"blake", answer:{ req:[1, 3, 5, 7], opt:[], never:[2, 4, 6] } }
    ],
    blake:{ line:"Ty·ger Ty·ger, burn·ing bright,", cite:"William Blake, “The Tyger” (1794), line 1", marks:[1, 3, 5, 7], tag:"DUM-da (trochaic)" },
    s73tag:"da-DUM (iambic)",
    lb:{
      weak:["the", "a", "an", "of", "and", "to", "so", "that", "its", "she", "we", "along"],
      sentences:[
        { id:"letter", label:"The letter", text:"I kept your letter in the drawer for years and never opened it." },
        { id:"map", label:"The map", text:"My grandmother folded the map along its old creases, the way she folded everything, so that the roads we never took stayed hidden inside." }
      ],
      cite:"Original sentences, written for this module."
    },
    tone:{ poem:"rem", at:9, from:"pleading", to:"releasing" },
    voiceNote:"Read it aloud yourself. Your voice is the best instrument.",
    aha:"Metre is a background beat; meaning lives where the poet pushes against it. Form is a shape of thought: watch where the poem turns, and what it leaves hanging at the ends of lines.",
    predIntro:"Make a prediction first. Then the studio reads it aloud and shows you what happens.",
    predictions:[
      { id:"p1",
        prompt:"Line 4 packs in more stresses than line 1. When it’s read aloud, what will the extra stresses do?",
        options:[{ t:"It slows the line down, so the ruin feels heavy and mournful", ok:true }, { t:"It speeds the line up and makes it cheerful" }, { t:"It makes the line rhyme with line 1" }, { t:"Nothing; stress doesn’t change how a line feels" }],
        explain:"Stresses take time to say. Crowding them together (BARE RU-ined CHOIRS … SWEET BIRDS SANG) makes the voice drag, like the slow fall of the speaker’s “year”." },
      { id:"p2",
        prompt:"If we break the line right after “never”, which word gains the most weight?",
        options:[{ t:"“never”, left hanging at the end of the line", ok:true }, { t:"“letter”" }, { t:"“drawer”" }, { t:"“years”" }],
        explain:"The end of a line is a spotlight. Leave “never” there, and the reader holds it for a beat before the sentence finishes. That’s the power of <strong>enjambment</strong>." },
      { id:"p3",
        prompt:"Where will this sonnet turn?",
        options:[{ t:"Line 9: “Yet if you should forget me for a while”", ok:true }, { t:"Line 13, the last two lines" }, { t:"Line 5: “Remember me when no more day by day”" }, { t:"It never turns; it repeats “remember”" }],
        explain:"A Petrarchan sonnet poses something in eight lines and answers it in six. Rossetti’s speaker spends the octave asking to be remembered, then turns at “Yet” to say it’s better to forget and smile than remember and be sad.",
        letters:"abbaabbacddece" },
      { id:"p4",
        prompt:"This line starts on a stressed syllable: TY-ger TY-ger. What will that do compared with an iambic line?",
        options:[{ t:"It sounds like a chant or hammer strokes, with each stress landing hard at the start", ok:true }, { t:"It sounds hesitant and soft" }, { t:"It sounds like ordinary conversation" }, { t:"There’s no difference; all metres sound the same" }],
        explain:"Trochees (DUM-da) open with a strike. That suits a poem that later asks “What the hammer? what the chain?” The rhythm forges the tiger." }
    ],
    chalIntro:"Use the studio to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right poem and mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1,
        prompt:"Mark the stressed syllables in line 1 of Sonnet 73. <button type='button' class='btn ghost sm rp-setup' data-setup='tc1'>Set it up</button>",
        why:"TIME, YEAR, MAYST, (ME), -HOLD: da-DUM, five times. The key accepts “me” marked or left light.",
        msgs:{ none:"In Listen & scan, tap the stressed syllables in line 1 of Sonnet 73.",
          odd:"You’ve read it as DUM-da. Say it aloud: “that TIME of YEAR”. Does <em>of</em> really carry weight?",
          all:"Not every syllable is stressed. Small words like <em>of</em>, <em>thou</em> and <em>in</em> usually fall light.",
          few:"You’ve found some of the beats. Listen for five." },
        hints:["Play the line with “emphasize stresses” off, and tap along as you’d clap a beat.", "The pattern is da-DUM, five times: that TIME…", "TIME, YEAR, MAYST, (ME), -HOLD: syllables 2, 4, 6, (8) and 10."] },
      { id:"tc2", goal:3,
        prompt:"Letter the rhyme scheme of Sonnet 73 and choose its form. <button type='button' class='btn ghost sm rp-setup' data-setup='tc2'>Set it up</button>",
        why:"abab cdcd efef gg: three quatrains and a couplet, which makes it Shakespearean.",
        msgs:{ unlettered:"Letter the last word of all 14 lines first.",
          reuse:"<em>Day</em> doesn’t rhyme with <em>behold</em>. Each new rhyme sound gets a new letter.",
          lieby:"Say <em>lie</em> and <em>by</em> aloud. They rhyme, so they share a letter.",
          pattern:"Read just the last words aloud, in pairs. Lines that rhyme share a letter; each new sound gets the next letter.",
          petrarchan:"A Petrarchan octave rhymes abbaabba. Here the rhymes alternate in three quatrains and end in a couplet.",
          form:"The letters are right. Now choose the form they make." },
        hints:["Read just the last words: behold, hang, cold, sang…", "behold/cold = a, hang/sang = b. Then new sounds: day/away…", "abab cdcd efef gg: three quatrains and a couplet, which makes it Shakespearean."] },
      { id:"tc3", goal:4, stretch:true,
        prompt:"<strong>Line-break lab:</strong> break this sentence into <strong>exactly 4 lines</strong> so that (1) no line ends on a weak word, (2) one line ends on “never”, creating suspense, and (3) the last line is the shortest. <span class='rp-sent'>“My grandmother folded the map along its old creases, the way she folded everything, so that the roads we never took stayed hidden inside.”</span> <button type='button' class='btn ghost sm rp-setup' data-setup='tc3'>Set it up</button>",
        why:"Notice what “never / took” does. The roads never taken hang at the line’s edge for a moment before you learn they stay hidden. You’ve just used enjambment as a writer.",
        msgs:{ weak:"Lines ending on small words feel like stumbles. Move the break.", count:"Exactly four lines.", last:"The last line should be the shortest, so the poem narrows to its ending.",
          never:"End one line on “never”, so the reader waits to learn what was never done." },
        hints:["Start by putting a break after “never”. What has to follow on the next line?", "“took stayed hidden inside” is four words; can it be your last line?",
          "Try: “…folded the map / along its old creases, the way she folded / everything, so that the roads we never / took stayed hidden inside.”"] }
    ],
    blocks:[{ title:"Notes on the texts", html:"<p><strong>Emily Dickinson.</strong> The stanza is quoted from <em>Poems</em> (1890), where her first editors titled the poem “The Chariot” and regularized her punctuation. Modern editions restore her dashes.</p><p><strong>E. Pauline Johnson (Tekahionwake)</strong> was a Mohawk (Kanienʼkehá꞉ka) and English poet and performer who toured Canada reciting her own work. Read her as a poet in her own right, in her own words. <span class='muted'>Teacher note: module 15 gives guidance on reading Indigenous texts responsibly.</span></p><p><strong>Gerard Manley Hopkins</strong> wrote “Pied Beauty” in 1877; it was first published in 1918.</p><p class='tiny muted'>Every poem in this module is in the public domain. Sonnet 73 and Keats’s sonnet use modern spelling.</p>" }]
  },
  part3:{
    slug:"form", name:"Form",
    heading:"Form makes meaning",
    intro:"Explore trained your ear. This part trains your eye on structure: four stations show how the shape of Sonnet 73 carries its meaning.",
    form:{
      st1:{ title:"Station 1: three pictures, shrinking time",
        how:"Read each quatrain. Then put the time ribbons in order, from the longest span to the shortest.",
        panels:[{ q:1, from:1, to:4, pic:"tree", name:"a tree in late autumn" }, { q:2, from:5, to:8, pic:"dusk", name:"twilight after sunset" }, { q:3, from:9, to:12, pic:"fire", name:"the glow of a fire on its own ashes" }],
        ribbons:[{ id:"year", t:"a year (seasons)", ticks:["spring", "summer", "autumn", "winter"] }, { id:"day", t:"a day", ticks:["morning", "noon", "sunset", "night"] }, { id:"min", t:"the last minutes of a fire", ticks:["flame", "glow", "ash"] }],
        start:["min", "year", "day"], order:["year", "day", "min"],
        caption:"Each picture of the speaker’s ageing covers less time and comes closer to the end." },
      st2:{ title:"Station 2: the repeated door",
        how:"Tap each line where the speaker opens a quatrain with “in me”.",
        find:[{ line:1, phrase:"in me behold" }, { line:5, phrase:"In me thou see’st" }, { line:9, phrase:"In me thou see’st" }],
        wrong:"That line doesn’t open with “in me”. Look at how each quatrain begins: lines 1, 5 and 9.",
        note:"Each quatrain opens the same way, like a door into a new, darker room." },
      st3:{ title:"Station 3: the turn to <em>you</em>",
        how:"The tracker counts who each part of the poem is about. Then tap the line where the poem turns.",
        parts:[{ t:"Quatrain 1", from:1, to:4 }, { t:"Quatrain 2", from:5, to:8 }, { t:"Quatrain 3", from:9, to:12 }, { t:"Couplet", from:13, to:14 }],
        choose:[9, 10, 11, 12, 13, 14], turn:13,
        wrong:"That line still pictures the speaker’s ending. Find the line that turns to “thou” and “thy love”.",
        found:"Line 13 turns: quatrains 1–3 are about “me”; the couplet turns to “thy love”.",
        craft:"<p>The couplet takes the three pictures of loss and reframes them as a reason to love more strongly now: “To love that well which thou must leave ere long” (Shakespeare, line 14).</p><p>The year, the day and the fire each said “I am ending”. The couplet answers: <em>because</em> you can see it, love me more.</p>" },
      st4:{ title:"Station 4: the fire’s paradox",
        line:12, text:"Line 12 glows. The fire is choked by the ashes of the wood that once fed it.",
        prompt:"What does the paradox suggest about the speaker’s life?",
        options:[
          { t:"What kept him alive (time, youth, living itself) is now what uses him up", ok:true, why:"The ashes are the youth he has already burned: the same thing that fed the fire now smothers it." },
          { t:"He is sitting beside a real fire as he writes", why:"The fire is the third picture of the speaker’s ageing, not a scene from his evening." },
          { t:"His youth will come back, as a fire can be relit", why:"Ashes can’t feed a fire again; every picture in the poem moves only toward the end." },
          { t:"He has grown tired of the person he loves", why:"Nothing turns against the listener; the couplet asks for more love, not less." }] }
    },
    quickCheck:{ title:"Form makes meaning: quick check", summary:"Form makes meaning quick check",
      items:[
        { id:"q1", goal:3, prompt:"Put Sonnet 73’s three images in the order they appear.",
          choices:[{ t:"autumn tree → twilight → dying fire", ok:true, fb:"Right. Year (lines 1–4), day (5–8), fire (9–12)." },
            { t:"twilight → autumn tree → fire", fb:"Reread the quatrain openings: year (lines 1–4), day (5–8), fire (9–12)." },
            { t:"fire → twilight → tree", fb:"Reread the quatrain openings: year (lines 1–4), day (5–8), fire (9–12)." },
            { t:"tree → fire → twilight", fb:"Reread the quatrain openings: year (lines 1–4), day (5–8), fire (9–12)." }] },
        { id:"q2", goal:5, prompt:"Why does the time span shrink from image to image?",
          choices:[{ t:"It brings the speaker’s death closer with each picture", ok:true, fb:"Right. The order is an argument: each picture is nearer the end." },
            { t:"It shows the poem is about seasons", fb:"The order is an argument: each picture is nearer the end." },
            { t:"It makes the rhyme easier", fb:"The order is an argument: each picture is nearer the end." },
            { t:"It has no purpose", fb:"The order is an argument: each picture is nearer the end." }] },
        { id:"q3", goal:3, prompt:"Where does Sonnet 73 turn, and to whom?",
          choices:[{ t:"Line 13, to the listener (“thou”)", ok:true, fb:"Right. The couplet shifts from “me” to “thy love”." },
            { t:"Line 9, to the fire", fb:"The couplet shifts from “me” to “thy love”." },
            { t:"Line 5, to the reader’s past", fb:"The couplet shifts from “me” to “thy love”." },
            { t:"It doesn’t turn", fb:"The couplet shifts from “me” to “thy love”." }] },
        { id:"q4", goal:5, prompt:"Which best states the craft → meaning link?",
          choices:[{ t:"“Three shrinking images of ending make the couplet’s call to love urgently feel earned.”", ok:true, fb:"Right. It names the craft <em>and</em> what it does to the meaning." },
            { t:"“The poem uses metaphors.”", fb:"Name the craft <em>and</em> what it does to the meaning." },
            { t:"“Shakespeare was getting old.”", fb:"Name the craft <em>and</em> what it does to the meaning." },
            { t:"“The poem rhymes abab.”", fb:"Name the craft <em>and</em> what it does to the meaning." }] }
      ] },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class='steal-line'>“Consumed with that which it was nourished by.”</p><p class='eng-cite'>Shakespeare, Sonnet 73, line 12</p><p><strong>The shape:</strong> something <em>destroyed by</em> what once <em>sustained</em> it.</p><p><strong>Example:</strong> “Worn down by the very road that carried her home.”</p><p>Write your own with the same shape. Keep the shape; change the content.</p>",
      prompt:"Your imitation" }]
  },
  practice:{
    activities:[
      { id:"sort", type:"custom", kind:"sorter", title:"Sound sort", summary:"Sound sort", noun:"line", txt:true, goal:2,
        instruction:"Each line has one highlighted part. Sort the highlight by the device it shows.",
        how:"Tap a line, then tap the box for the device its highlighted part shows.",
        boxes:[{ id:"allit", label:"Alliteration" }, { id:"asson", label:"Assonance" }, { id:"irhyme", label:"Internal rhyme" }, { id:"onom", label:"Onomatopoeia" }, { id:"caes", label:"Caesura" }],
        msgs:{ asson:M_ASSON, onom:M_ONOM, irhyme:M_IRH, caes:M_CAES },   // mismatch feedback; items name a key (wrong) or apply one to every other box (wrongAll)
        wrongDefault:"Say the highlighted words aloud. Is it a consonant, a vowel, a rhyme, an imitation or a pause? Try another box.",
        items:[
          { id:"i1", t:"Once upon a midnight " + hl("dreary") + ", while I pondered, weak and " + hl("weary") + src("Poe, “The Raven”"), answer:"irhyme", why:"<em>Dreary</em> and <em>weary</em> fully rhyme inside one line.", wrong:{ asson:"irhyme" },
            hints:SH("Do the two words share only a vowel, or do they fully rhyme?", "Internal rhyme: <em>dreary</em> and <em>weary</em> fully rhyme inside one line.") },
          { id:"i2", t:"The fair breeze " + hl("blew") + ", the white foam " + hl("flew") + src("Coleridge, “The Rime of the Ancient Mariner”"), answer:"irhyme", why:"<em>Blew</em> and <em>flew</em> rhyme inside the line.", wrong:{ asson:"irhyme" },
            hints:SH("Do <em>blew</em> and <em>flew</em> share only a vowel, or the whole ending?", "Internal rhyme: <em>blew</em> and <em>flew</em> rhyme inside the line.") },
          { id:"i3", t:"The " + hl("furrow followed free") + src("Coleridge"), answer:"allit", why:"<em>Furrow</em>, <em>followed</em> and <em>free</em> all start with the <em>f</em> sound.",
            hints:SH(SAME, "Alliteration: <em>furrow</em>, <em>followed</em> and <em>free</em> repeat the <em>f</em> consonant at the start.") },
          { id:"i4", t:"Season of " + hl("mists") + " and " + hl("mellow") + " fruitfulness" + src("Keats, “To Autumn”"), answer:"allit", why:"<em>Mists</em> and <em>mellow</em> repeat the <em>m</em> consonant sound.",
            hints:SH(SAME, "Alliteration: <em>mists</em> and <em>mellow</em> both start with <em>m</em>.") },
          { id:"i5", t:"Hear the " + hl("mellow wedding bells") + src("Poe, “The Bells”"), answer:"asson", why:"The short <em>e</em> vowel repeats: m<strong>e</strong>llow, w<strong>e</strong>dding, b<strong>e</strong>lls.", wrong:{ allit:"asson" },
            hints:SH(SAME, "Assonance: the short <em>e</em> vowel repeats in m<strong>e</strong>llow, w<strong>e</strong>dding, b<strong>e</strong>lls.") },
          { id:"i6", t:"Thou still unravish’d " + hl("bride") + " of " + hl("quietness") + src("Keats, “Ode on a Grecian Urn”"), answer:"asson", why:"The long <em>i</em> vowel repeats in <em>bride</em> and <em>quietness</em>.", wrong:{ allit:"asson" },
            hints:SH("Listen to the vowel in <em>bride</em> and in <em>qui-</em>. Same consonant, or same vowel?", "Assonance: the long <em>i</em> vowel repeats in <em>bride</em> and <em>quietness</em>.") },
          { id:"i7", t:"And " + hl("murmuring") + " of innumerable bees" + src("Tennyson, <i>The Princess</i>"), answer:"onom", why:"<em>Murmuring</em> hums like the bees it describes.", wrong:{ allit:"onom" },
            hints:SH(IMIT, "Onomatopoeia: <em>murmuring</em> imitates the low hum of the bees.") },
          { id:"i8", t:"the " + hl("tintinnabulation") + " that so musically wells" + src("Poe, “The Bells”"), answer:"onom", why:"The long, ringing word imitates the bells.", wrong:{ allit:"onom" },
            hints:SH(IMIT, "Onomatopoeia: <em>tintinnabulation</em> rings like the bells it names.") },
          { id:"i9", t:"When yellow leaves" + hl(",") + " or none" + hl(",") + " or few" + hl(",") + " do hang" + src("Shakespeare, Sonnet 73"), answer:"caes", why:"The commas make pauses in the middle of the line.", wrongAll:"caes",
            hints:SH(PUNCT, "Caesura: the commas make pauses in the middle of the line.") },
          { id:"i10", t:"To err is human" + hl(";") + " to forgive, divine" + src("Pope, <i>An Essay on Criticism</i>"), answer:"caes", why:"The semicolon makes a strong pause in mid-line, balancing the two halves.", wrongAll:"caes",
            hints:SH(PUNCT, "Caesura: the semicolon makes a strong pause in mid-line.") },
          { id:"i11", t:hl("Fresh-firecoal") + " chestnut-falls; " + hl("finches’") + " wings" + src("Hopkins, “Pied Beauty”"), answer:"allit", why:"<em>Fresh-firecoal</em> and <em>finches’</em> both start with the <em>f</em> sound.",
            hints:SH(SAME, "Alliteration: <em>Fresh-firecoal</em> and <em>finches’</em> both start with <em>f</em>.") }
        ],
        soWhat:{ title:"So what?", intro:"Not scored. For three of the lines, choose the effect that fits best.",
          items:[
            { id:"i3", line:"“The furrow followed free”", options:[
              { t:"The soft, breathy <em>f</em> sounds let the ship slide along easily, as free as the line says.", ok:true },
              { t:"The <em>f</em> sounds make the line harsh and violent." },
              { t:"The <em>f</em> sounds slow the ship to a stop." }] },
            { id:"i5", line:"“Hear the mellow wedding bells”", options:[
              { t:"The repeated short <em>e</em> rings softly, like the bells it describes.", ok:true },
              { t:"The vowels make the line sound angry." },
              { t:"The vowels make the bells sound far away and silent." }] },
            { id:"i9", line:"“When yellow leaves, or none, or few, do hang”", options:[
              { t:"The commas make the speaker sound as if he’s counting the last leaves, hesitating.", ok:true },
              { t:"The commas make the line rush forward." },
              { t:"The commas show the leaves falling quickly." }] }
          ],
          good:"That’s the effect most careful readers hear.", bad:"Read it aloud again. Does the sound really do that? Try another." } },
      { id:"unseen", type:"custom", title:"Unseen poem: “The Eagle”", summary:"Unseen poem", star:true, goal:[1, 2, 3, 4, 5],
        instruction:"Read Tennyson’s poem (or listen to it), then work through the six questions. E4–E6 go beyond the Final Check.",
        how:"Each question has three levels of help. Wrong answers show why; try again.",
        poem:EAGLE, cite:"Alfred, Lord Tennyson, “The Eagle” (1851)",
        items:[
          { id:"e1", kind:"tap", goal:1, prompt:"<strong>E1.</strong> Mark the stresses in line 1.", line:"He clasps the crag with crook·ed hands;",
            answer:[2, 4, 6, 8], light:"Read it aloud; <em>clasps</em> and <em>crag</em> carry the push.", general:"Read it aloud and tap along. Listen for four beats.",
            why:"he CLASPS the CRAG with CROOK-ed HANDS: syllables 2, 4, 6, 8.",
            hints:["Say the line aloud and clap the beats.", "Four beats, each on the second syllable of a pair: he CLASPS…", "he CLASPS the CRAG with CROOK-ed HANDS: syllables 2, 4, 6, 8."] },
          { id:"e2", kind:"mc", goal:1, prompt:"<strong>E2.</strong> Name the metre of line 1.",
            options:[
              { t:"Iambic tetrameter", ok:true, why:"Four da-DUM feet: he CLASPS | the CRAG | with CROOK- | ed HANDS." },
              { t:"Iambic pentameter", why:"Count the beats: four, not five." },
              { t:"Trochaic tetrameter", why:"The line starts light (he CLASPS), so its feet are iambs, not trochees." },
              { t:"Free verse", why:"There’s a steady four-beat pattern, and the lines rhyme." }],
            hints:["Count the stresses you marked in E1.", "Four beats, and each foot goes da-DUM.", "Iambic tetrameter: four iambs."] },
          { id:"e3", kind:"letters", goal:3, prompt:"<strong>E3.</strong> Letter the rhyme scheme.", ends:["hands", "lands", "stands", "crawls", "walls", "falls"],
            answer:"aaabbb", wrongs:[{ p:"aabbcc", fb:"<em>hands</em>/<em>lands</em>/<em>stands</em> share one sound." }],
            general:"Say the six end words aloud. Lines that rhyme share a letter; a new sound gets the next letter.",
            why:"aaa bbb: each stanza rhymes on one sound.",
            hints:["Read only the end words: hands, lands, stands, crawls, walls, falls.", "How many different end sounds do you hear?", "aaa bbb: hands, lands, stands = a; crawls, walls, falls = b."] },
          { id:"e4", kind:"mc", star:true, goal:[1, 5], prompt:"<strong>E4.</strong> <span class='tag'>★</span> Line 2 begins CLOSE to the SUN. What is this variation, and what does it do?",
            options:[
              { t:"A trochaic inversion: the stressed first syllable thrusts the eagle upward, “close to the sun”", ok:true, why:"The first foot flips to DUM-da, so the line launches on a stress, as the eagle sits high above everything." },
              { t:"A spondee: two stresses side by side", why:"Only one stress in the first foot: CLOSE to." },
              { t:"No variation: the line is regular", why:"Say it aloud: it starts on a stress." },
              { t:"A feminine ending: an extra soft syllable at the end of the line", why:"The line ends on a stress: LANDS. The change is at the start." }],
            hints:["Say line 2 aloud. Where does the first beat fall?", "CLOSE to: a stress, then a light syllable, where the iambic lines start light.", "A trochaic inversion: the stressed first syllable thrusts the eagle upward."] },
          { id:"e5", kind:"sa", star:true, goal:[2, 5], prompt:"<strong>E5.</strong> <span class='tag'>★</span> Which two devices make the eagle godlike and the world below small? (Select 2.)",
            options:[
              { t:"Personification of the eagle (“crooked hands”)", ok:true, why:"" },
              { t:"Personification of the sea (“wrinkled”, “crawls”)", ok:true, why:"" },
              { t:"Onomatopoeia", why:"No sound is imitated." },
              { t:"A simile in “crawls”", why:"No <em>like</em> or <em>as</em> there." }],
            why:"The eagle gets human hands and stands like a king; the sea is old and wrinkled and only crawls. One is raised up, the other made small.",
            hints:["Who is given human features, and what are they?", "Look at the eagle’s hands and the sea’s skin and movement.", "Personification of the eagle (“crooked hands”) and of the sea (“wrinkled”, “crawls”)."] },
          { id:"e6", kind:"mc", star:true, goal:[4, 5], prompt:"<strong>E6.</strong> <span class='tag'>★</span> Why does the final line land so suddenly? (Choose the best explanation.)",
            options:[
              { t:"It’s the only simile, and the poem’s last word, “falls”, is the one moment of motion after five lines of stillness", ok:true, why:"Clasps, stands, watches: stillness. Then the only simile and the only motion arrive together, at the very end." },
              { t:"Because it rhymes", why:"Every line rhymes; that doesn’t make it sudden." },
              { t:"Because it’s the longest line", why:"It isn’t." },
              { t:"Because the eagle dies", why:"Nothing says it dies; it dives." }],
            hints:["What is the eagle <em>doing</em> in lines 1–5?", "Clasps, stands, watches: stillness. Then?", "The only simile, and the only motion, comes last: “like a thunderbolt he falls.”"] }
        ] },
      { id:"spot", type:"custom", title:"Spot the error", summary:"Spot the error", student:"Darnell", goal:[2, 3, 5],
        instruction:"Darnell made one mistake in each paragraph. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:5, task:"Write about Sonnet 73’s three images.",
            steps:["In Sonnet 73, the speaker compares his ageing to late autumn, twilight and a dying fire.", "Each image covers a shorter stretch of time than the one before.",
              "This proves that Shakespeare himself was an old man when he wrote the poem.", "The couplet turns to the listener: “This thou perceiv’st, which makes thy love more strong” (13).",
              "The poem suggests love grows stronger when we know we will lose what we love."],
            answer:2,
            stepFb:["Sentence 1 is accurate. Keep checking.", "Sentence 2 is right: year, day, minutes.", "", "Sentence 4 is fine. The mistake is earlier.", "Sentence 5 is a sound interpretation."],
            fixes:[
              { t:"This suggests the speaker feels his own end coming closer with each picture.", ok:true, why:"It stays with the speaker and with what the shrinking images suggest." },
              { t:"This proves Shakespeare was sick in 1609.", why:"That’s a biographical claim the poem doesn’t support." },
              { t:"This shows the poem is really about the seasons.", why:"The seasons are the comparison, not the subject." },
              { t:"Sentence 3 is correct.", why:"The speaker isn’t the poet; the text can’t prove Shakespeare’s age." }],
            hints:["Who is the “I” of a poem?", "Can a poem prove its author’s age?", "Write about the speaker."] },
          { id:"e2", goal:3, task:"Explain the structure of Rossetti’s “Remember”.",
            steps:["“Remember” is a Petrarchan sonnet.", "Its octave repeats the command “Remember me”.", "The turn comes in line 13, where the final couplet begins.", "After the turn, the speaker allows the listener to forget."],
            answer:2,
            stepFb:["Sentence 1 is right: abbaabba in the octave.", "Sentence 2 is accurate.", "", "Sentence 4 describes the turn, but the line number came earlier."],
            fixes:[
              { t:"The turn comes at line 9, with “Yet”, where the sestet begins and the speaker releases the listener.", ok:true, why:"Petrarchan sonnets turn where the sestet begins, and “Yet” marks it." },
              { t:"There is no turn in a Petrarchan sonnet.", why:"Petrarchan sonnets turn at the sestet." },
              { t:"The turn comes in line 1.", why:"Line 1 sets up the request." },
              { t:"Sentence 3 is correct.", why:"The last two lines aren’t a separate couplet here: the sestet rhymes cddece." }],
            hints:["Where does a Petrarchan sonnet usually turn?", "Find the word that changes direction.", "“Yet”, line 9."] },
          { id:"e3", goal:2, task:"Analyse the sound of Johnson’s opening stanza.",
            steps:["In the opening stanza of “The Song My Paddle Sings,” the speaker calls on the west wind to fill an idle sail.",
              "The repeated command “blow” (“Blow from the mountains, blow from the west”) makes the speaker sound impatient.",
              "“West wind” uses alliteration, binding the speaker’s two words of address together.", "The exclamation “Blow, blow!” is onomatopoeia.",
              "Together, the sounds turn the waiting into a playful courtship."],
            answer:3,
            stepFb:["Sentence 1 is an accurate paraphrase.", "Sentence 2 links repetition to an effect: good.", "Sentence 3 is right: <em>w</em>, <em>w</em>.", "", "Sentence 5 is a good conclusion. Check sentence 4’s label."],
            fixes:[
              { t:"“Blow, blow!” is repetition in a short, two-beat line; the clipped rhythm sounds like a lover’s impatient call.", ok:true, why:"It names what the words really do: a repeated command in a clipped line." },
              { t:"“Blow, blow!” is a simile.", why:"No comparison with <em>like</em> or <em>as</em>." },
              { t:"“Blow, blow!” is assonance only.", why:"The point here is the repeated word and its rhythm." },
              { t:"Sentence 4 is correct.", why:"<em>Blow</em> doesn’t imitate the sound of wind; it’s a command." }],
            hints:["Does the word <em>blow</em> sound like wind?", "What is the speaker doing with the word?", "Repeating a command."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which line in this module did you <em>hear</em> differently once you marked its stresses? What changed?" },
      { id:"j2", q:"Why do careful readers write “the speaker” instead of the poet’s name? Use Sonnet 73 as your example." },
      { id:"j3", q:"Explain to a friend how to find the turn in a sonnet, in three steps." },
      { id:"j4", q:"What part of reading poetry still feels like guessing? What will you practise next?" }
    ],
    blocks:[{ title:"Commonplace book", html:"<p>Save one line from this module you’d like to keep, and add a sentence about why it stays with you.</p><div id='cp-app'></div>" }],
    art:{
      intro:"Write one craft principle about poetry <em>in your own words</em>. Give a master’s example from this module and write your own line that uses the principle.",
      placeholder:"Your principle, in one sentence",
      examples:MASTER
    },
    artSamples:[
      { p:"Stresses slow a line, and light syllables speed it.", m:"Bare ruined choirs, where late the sweet birds sang", i:"Cold, grey, wet, the long road home." },
      { p:"A poem’s turn is where its argument changes its mind.", m:"Yet if you should forget me for a while", i:"I wanted the city’s noise to stop, until it did." }
    ],
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is the metre of this line by Keats? “When I have fears that I may cease to be”", options:[
          { t:"Iambic pentameter", ok:true, why:"when I | have FEARS | that I | may CEASE | to BE: five da-DUM feet." },
          { t:"Trochaic pentameter", why:"The line starts light, not on a stress." },
          { t:"Iambic tetrameter", why:"Count again: five stressed beats." },
          { t:"Free verse", why:"There’s a steady five-beat pattern." }] },
        b:{ prompt:"What is the metre of this line by Rossetti? “Remember me when I am gone away”", options:[
          { t:"Iambic pentameter", ok:true, why:"re-MEM | ber ME | when I | am GONE | a-WAY." },
          { t:"Trochaic pentameter", why:"<em>Re-</em> is unstressed; the line begins light." },
          { t:"Iambic trimeter", why:"There are five feet, not three." },
          { t:"Free verse", why:"The da-DUM pattern is regular." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"A 14-line poem rhymes abab cdcd efef gg. What is its form?", options:[
          { t:"A Shakespearean sonnet", ok:true, why:"Three quatrains and a closing couplet." },
          { t:"A Petrarchan sonnet", why:"Petrarchan octaves rhyme abbaabba." },
          { t:"A ballad", why:"Ballads use quatrains, but not this 14-line pattern." },
          { t:"Free verse", why:"Free verse has no fixed rhyme scheme." }] },
        b:{ prompt:"A 14-line poem rhymes abbaabba cdecde. What is its form?", options:[
          { t:"A Petrarchan sonnet", ok:true, why:"An octave (abbaabba) and a sestet." },
          { t:"A Shakespearean sonnet", why:"Shakespearean sonnets alternate rhymes in quatrains." },
          { t:"A couplet poem", why:"Couplets rhyme in pairs: aabb…" },
          { t:"Free verse", why:"There’s a fixed scheme here." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which device is in the highlighted words? “So <strong>dawn</strong> goes <strong>down</strong> to <strong>day</strong>.” (Frost, “Nothing Gold Can Stay”)", options:[
          { t:"Alliteration", ok:true, why:"The <em>d</em> consonant repeats at the start of the words." },
          { t:"Assonance", why:"Assonance repeats vowels; here it’s the consonant <em>d</em>." },
          { t:"Onomatopoeia", why:"None of the words imitates a sound." },
          { t:"Caesura", why:"There’s no mid-line pause in the highlight." }] },
        b:{ prompt:"Which device is in the highlighted word? “From the jingling and the <strong>tinkling</strong> of the bells.” (Poe, “The Bells”)", options:[
          { t:"Onomatopoeia", ok:true, why:"<em>Tinkling</em> sounds like the light ring it names." },
          { t:"Alliteration", why:"One word can’t alliterate by itself." },
          { t:"Caesura", why:"That’s a pause, not a sound-word." },
          { t:"Internal rhyme", why:"The highlight is one word imitating a sound." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Read Keats’s sonnet “When I have fears that I may cease to be”. Where does it turn, and what changes?" + SAY("t1a") + passage(KEATS), options:[
          { t:"Midway through line 12, at “—then on the shore”: the speaker stops listing what he might lose and steps back to see love and fame shrink to nothing", ok:true, why:"The dash marks the turn; the last two and a half lines change the stance from fear to stillness." },
          { t:"Line 9, where “fair creature of an hour” begins: the poem becomes only a love poem", why:"Line 9 continues the list of fears: “And when I feel…”." },
          { t:"Line 13, the couplet: the speaker decides to write more poems", why:"Nothing says he decides to write; he thinks “Till love and fame to nothingness do sink”." },
          { t:"It never turns; it’s a list of fears", why:"The list stops at the dash, and the stance changes." }] },
        b:{ prompt:"Read Rossetti’s “Remember”. Where does it turn, and what changes?" + SAY("t1b") + "<div class='rp-qpass' data-poem='rem'></div>", options:[
          { t:"At line 9, “Yet”: the speaker moves from asking to be remembered to permitting the listener to forget and be happy", ok:true, why:"“Yet” begins the sestet: the octave pleads to be remembered; the sestet releases the listener." },
          { t:"Line 13: the speaker demands to be remembered forever", why:"Lines 13–14 say it’s “better by far” to forget and smile." },
          { t:"Line 5: the speaker stops speaking to the listener", why:"“Remember me when no more day by day / You tell me…” still addresses the listener." },
          { t:"It never turns", why:"“Yet” signals a reversal." }] } },
      { id:"t2", cat:"T", goal:[2, 5],
        a:{ prompt:"McCrae, “In Flanders Fields”, lines 1–5:" + SAY("t2a") + passage(MCCRAE) + "“…and in the sky / The larks, still bravely singing, fly / Scarce heard amid the guns below.” What does the contrast between the larks and the guns suggest?", options:[
          { t:"That life and beauty persist, but faintly, against the overwhelming noise of war", ok:true, why:"“Still bravely singing” but “scarce heard”: courage that is nearly drowned out." },
          { t:"That the larks are frightened and silent", why:"The larks are “singing” and “brave”." },
          { t:"That the guns have stopped", why:"“Amid the guns below”: the guns are still firing." },
          { t:"That the speaker simply enjoys birdsong", why:"That’s a summary of one detail; it misses the contrast." }] },
        b:{ prompt:"Frost, “Nothing Gold Can Stay”:" + SAY("t2b") + passage(FROST) + "What does the line “So Eden sank to grief” add to the poem’s pattern of images?", options:[
          { t:"It widens the pattern from nature’s brief gold to human history: every first, perfect state falls", ok:true, why:"Leaf, flower, Eden, dawn: the same loss at every scale." },
          { t:"It shows the speaker is angry at nature", why:"No anger appears; the tone is quiet acceptance." },
          { t:"It introduces a new subject unrelated to the leaves", why:"“So” links it to the leaves: the same pattern." },
          { t:"It tells us Frost was religious", why:"That’s a biographical claim; the line works as an image." }] } },
      { id:"t3", cat:"T", goal:[1, 4],
        a:{ prompt:"An original poem:" + SAY("t3a") + passage(["She said she would call.", "I waited by the phone", "all", "night."]) + "What is the effect of placing “all” alone on a line?", options:[
          { t:"The isolated word slows the reader, and the white space around it makes the waiting feel long", ok:true, why:"One word alone on a line forces a pause, so the reader waits as the speaker did." },
          { t:"It’s a mistake; line breaks in free verse are random", why:"Free verse chooses its breaks; this one is deliberate." },
          { t:"It turns the poem into a sonnet", why:"Sonnets have 14 lines and a fixed pattern." },
          { t:"It shows the speaker forgot what to say", why:"Nothing suggests forgetting; the speaker is waiting." }] },
        b:{ prompt:"Blake’s “Tyger Tyger, burning bright” begins on a stressed syllable (TY-ger TY-ger). What is the effect?", options:[
          { t:"The stressed openings sound like a chant or hammer blows, fitting a poem about the tiger’s fierce making", ok:true, why:"Trochees (DUM-da) open with a strike, like the blows that forge the tiger." },
          { t:"It makes the line soft and hesitant", why:"Stressed openings strike; they don’t hesitate." },
          { t:"It makes the line iambic", why:"Iambs start light; this starts heavy." },
          { t:"It has no effect; metre is decoration", why:"Metre shapes how a line feels." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best analytical sentence about Keats’s “Before high-pilèd books, in charactery, / Hold like rich garners the full ripened grain”?", options:[
          { t:"“Keats compares the poems he has not yet written to grain waiting for harvest, so his fear of death becomes a fear of wasted abundance.”", ok:true, why:"It names the craft (simile) and says what it does to the meaning." },
          { t:"“This line has a simile.”", why:"That names the device but stops before its effect." },
          { t:"“Keats was afraid of dying young because he was ill.”", why:"That’s biography, not analysis of the line." },
          { t:"“The books are compared to barns of grain.”", why:"That’s accurate, but it’s paraphrase without a “so what”." }] },
        b:{ prompt:"Which is the best analytical sentence about Johnson’s “I have wooed you so, / But never a favour you bestow”?", options:[
          { t:"“By wooing the wind like a suitor who ‘never’ wins ‘a favour,’ the speaker turns a stalled journey into a playful courtship.”", ok:true, why:"It names the craft (the wind courted like a person) and says what it does to the meaning." },
          { t:"“There is personification in these lines.”", why:"That names the device but stops before its effect." },
          { t:"“Johnson loved canoeing.”", why:"That’s biography; analyse the speaker." },
          { t:"“The speaker says the wind won’t help.”", why:"That’s paraphrase without analysis." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which sentence quotes lines 3–4 of Sonnet 73 correctly in MLA style?", options:[
          { t:"The speaker sees himself in “those boughs which shake against the cold, / Bare ruined choirs, where late the sweet birds sang” (Shakespeare, lines 3–4).", ok:true, why:"Quotation marks, a spaced slash at the line break, and line numbers in the citation." },
          { t:"The speaker sees himself in “those boughs which shake against the cold, Bare ruined choirs, where late the sweet birds sang” (Shakespeare, lines 3–4).", why:"The line break isn’t marked." },
          { t:"The speaker sees himself in “those boughs which shake against the cold, / Bare ruined choirs, where late the sweet birds sang” (Shakespeare 73).", why:"Cite line numbers, not the sonnet’s number as a page." },
          { t:"The speaker sees himself in those boughs which shake against the cold, / Bare ruined choirs (Shakespeare, lines 3–4).", why:"Quoted words need quotation marks." }] },
        b:{ prompt:"Which sentence quotes lines 1–2 of “Remember” correctly in MLA style?", options:[
          { t:"The speaker pleads, “Remember me when I am gone away, / Gone far away into the silent land” (Rossetti, lines 1–2).", ok:true, why:"Quotation marks, a spaced slash at the line break, and line numbers in the citation." },
          { t:"The speaker pleads, “Remember me when I am gone away… Gone far away into the silent land” (Rossetti, lines 1–2).", why:"An ellipsis means words were cut; mark the line break with a slash." },
          { t:"The speaker pleads, “Remember me when I am gone away, / Gone far away into the silent land” (Rossetti 1).", why:"That reads as a page number; write “lines 1–2”." },
          { t:"The speaker pleads, Remember me when I am gone away, / Gone far away into the silent land (Rossetti, lines 1–2).", why:"Quotation marks are missing." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"A student wants to write a sonnet about leaving home in which the last two lines suddenly reverse everything before them. Which form fits best?", options:[
          { t:"A Shakespearean sonnet: three quatrains build the feeling, and the couplet delivers the reversal", ok:true, why:"Shakespearean sonnets usually turn in the couplet, so the reversal lands in the last two lines." },
          { t:"A Petrarchan sonnet, which turns in its final couplet", why:"Petrarchan sonnets turn at line 9, not in a couplet." },
          { t:"Free verse, because sonnets can’t reverse", why:"Sonnets are built to turn." },
          { t:"A ballad, because ballads end with a couplet", why:"Ballads are quatrain stories, not 14-line turns." }] },
        b:{ prompt:"A student wants eight lines building a question about a friendship, then six lines answering it. Which form fits best?", options:[
          { t:"A Petrarchan sonnet: octave for the question, sestet for the answer", ok:true, why:"A Petrarchan sonnet poses something in eight lines and answers it in six." },
          { t:"A Shakespearean sonnet, because it splits 8 and 6", why:"Shakespearean sonnets split 12 and 2." },
          { t:"A couplet poem", why:"Couplets don’t build an 8-and-6 structure." },
          { t:"Free verse, because sonnets can’t ask questions", why:"Sonnets often pose and answer." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"You’re reading “In Flanders Fields” aloud at a Remembrance Day assembly. Line 3 ends “…and in the sky” and the sentence continues into line 4. How should you read the end of line 3?", options:[
          { t:"Carry your voice on with only a slight hold, because the sentence runs into the next line (enjambment)", ok:true, why:"A line can end before the sentence does: the sky leads straight to the larks." },
          { t:"Stop fully, because every line end is a full stop", why:"Line ends aren’t sentence ends; the sky leads straight to the larks." },
          { t:"Speed up and skip the pause at “place;”", why:"The semicolon in line 3 <em>is</em> a pause; it’s the line end that runs on." },
          { t:"Drop your voice to a whisper to signal the end", why:"That signals finality where the sentence keeps going." }] },
        b:{ prompt:"You’re reading Sonnet 73, line 2, aloud: “When yellow leaves, or none, or few, do hang.” How should you treat the commas?", options:[
          { t:"Pause briefly at each one, so the hesitations sound like the speaker counting the last leaves", ok:true, why:"The commas are caesurae: brief pauses keep the line whole while it hesitates." },
          { t:"Read straight through; commas don’t matter aloud", why:"They create caesurae; the pauses are the meaning." },
          { t:"Stop fully at each comma, as if each were the end of a sentence", why:"Full stops would break the line apart; brief pauses keep it whole." },
          { t:"Raise the volume at each comma", why:"Volume isn’t the point; timing is." }] } }
    ]
  },
  task:{
    title:"Performance task: The Turn", summary:"The Turn",
    statement:"<p>Write a short poem (8–14 lines) about a moment of change. Give it a turn: a line where the poem changes direction. Use line breaks and sound on purpose. There are countless good answers; make yours.</p><p class='tiny muted'>This checklist makes sure the parts are there. Your teacher reads the writing.</p><details class='alg pt-rubric'><summary>How your teacher reads it (levels 1–4)</summary><div class='tbl-wrap'><table class='topic-tbl'><thead><tr><th scope='col'>Criterion</th><th scope='col'>Level 1</th><th scope='col'>Level 2</th><th scope='col'>Level 3</th><th scope='col'>Level 4</th></tr></thead><tbody><tr><td>Knowledge: devices used accurately</td><td>Tags often mislabel devices</td><td>Some accurate devices</td><td>Devices accurate and deliberate</td><td>Devices accurate, varied and subtle</td></tr><tr><td>Thinking: the turn</td><td>No real change of direction</td><td>A change, but weakly prepared</td><td>A clear, prepared turn</td><td>A turn that reframes the whole poem</td></tr><tr><td>Communication: sound and line breaks</td><td>Breaks and sounds seem random</td><td>Some purposeful choices</td><td>Breaks and sounds shape the reading</td><td>Breaks and sounds are inseparable from the meaning</td></tr><tr><td>Application: craft statement</td><td>Lists features</td><td>Describes choices</td><td>Explains choices and their effects</td><td>Explains choices with insight, citing their own lines</td></tr></tbody></table></div></details>",
    checks:["8 to 14 lines", "One turn, after the opening and before the end", "At least one enjambed line", "At least two sound devices, tagged", "Rhyme declared", "Craft statement"],
    tips:["Aim for 8–14 lines: enough room to build, then turn.",
      "Tag the line where your poem changes its mind. It can’t be one of the first four lines or the very last.",
      "An enjambed line ends without punctuation, so the sentence spills onto the next line.",
      "Tag two sound devices. For alliteration, the tagged words should start with the same consonant.",
      "Say whether you rhymed. If you did, give one letter per line.",
      "Tell your reader what you chose and why, in at least 40 words."],
    explainPrompt:"Craft statement: What did you choose (your turn, a line break, a sound) and what did you want the reader to feel because of it? Quote your own lines.",
    explainLabel:"Craft statement",
    vocab:"Use turn, enjambment, stress, and the names of your sound devices.",
    checkLabel:"Check my poem",
    success:"Your poem has all its parts. There are countless good answers. Here are three very different ones.",
    lineTags:["Turn", "Enjambment"],
    soundTags:["Alliteration", "Assonance", "Internal rhyme", "Onomatopoeia", "Caesura"],
    models:[
      { title:"Model 1: rhymed, with the turn late (8 lines, abab cdcd)",
        text:["The kitchen light stays on past ten,", "my father’s coffee going cold,", "the bills fanned out like cards again,", "a hand he never asked to hold.", "He hums a hymn he half forgot,", "then folds the paper, flat and neat,", "but in the morning there’s a pot", "of porridge waiting, warm and sweet."],
        tags:"Turn: line 7. Enjambment: line 7 (“there’s a pot”). Alliteration: “hums a hymn he half” (line 5); “pot / of porridge” (lines 7–8). Rhyme declared: abab cdcd.",
        craft:"I kept the first six lines tired and heavy, with the h-sounds like sighs, then turned on “but” so the porridge would feel like an answer. Breaking after “pot” makes the reader wait for the warmth…" },
      { title:"Model 2: free verse, with the turn mid-poem (9 lines)",
        text:["The river was a road all winter.", "We walked it, my brother and I,", "counting the black hearts of air", "under the ice,", "daring each other farther out.", "Then April spoke", "in a voice like splitting wood,", "and the road remembered", "it was water."],
        tags:"Turn: line 6. Enjambment: lines 6 and 8. Alliteration: “road remembered” (line 8). Assonance: “spoke … road”. Rhyme declared: free verse.",
        craft:"The poem stays on the ice until “Then April spoke”. I ended line 8 on “remembered” so the reader hangs in the moment before the surprise…" },
      { title:"Model 3: sound-driven, with a slant-rhymed close (10 lines)",
        text:["At six the city coughs awake:", "the buses hiss, a shutter clangs,", "a gull complains above the lake,", "the old pipes knock in sudden bangs.", "I used to pull the pillow tight", "and curse the clatter, curse the light.", "But now, a hundred miles from home,", "the silence hums inside my room,", "and I would trade a week of quiet", "for one loud minute of that riot."],
        tags:"Turn: line 7. Enjambment: line 9. Onomatopoeia: “hiss”, “clangs”, “knock”, “bangs”. Alliteration: “curse the clatter, curse” (line 6). Rhyme declared: abab cc dd ee.",
        craft:"I filled the first half with noise words so the silence after “But now” would feel loud by contrast…" }
    ]
  },
  cards:[
    ["Stress", "The extra push a syllable gets when spoken: be-HOLD. “That TIME of YEAR…”"],
    ["Iamb", "da-DUM, an unstressed then a stressed syllable: “be-HOLD”."],
    ["Iambic pentameter", "Five iambs per line: “That TIME of YEAR thou MAYST in ME be-HOLD” (Shakespeare)."],
    ["Trochee", "DUM-da: “TY-ger TY-ger, BURN-ing BRIGHT” (Blake)."],
    ["Spondee", "Two stresses side by side, which slows a line: “SWEET BIRDS SANG” (Shakespeare)."],
    ["Caesura", "A strong pause inside a line: “To err is human; to forgive, divine” (Pope)."],
    ["Enjambment", "A sentence running past the end of a line: “and in the sky / The larks…” (McCrae)."],
    ["Volta (turn)", "Where a poem changes direction: “Yet if you should forget me for a while” (Rossetti, line 9)."],
    ["Shakespearean sonnet", "Three quatrains and a couplet, abab cdcd efef gg; usually turns at line 13 (Sonnet 73)."],
    ["Petrarchan sonnet", "Octave (abbaabba) and sestet; turns at line 9 (Rossetti, “Remember”)."],
    ["Assonance", "Repeated vowel sounds: “Hear the mellow wedding bells” (Poe)."],
    ["Speaker", "The voice of the poem, never assumed to be the poet: “In me thou see’st the twilight…” is the speaker’s claim."]
  ]
};
