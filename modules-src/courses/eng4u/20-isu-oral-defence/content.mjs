// ENG4U 20 ISU Oral Defence. Plan: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/20-isu-oral-defence.md
// Texts: Hamlet 3.2, Globe edition (1864; public domain) with Globe line numbers as module 12’s R table: the speech opens
// at 3.2.1–2 and “suit the action to the word, the word to the action” is 3.2.19–20 in the Globe (the plan’s 17–18 is
// another edition’s count). Lincoln, Gettysburg Address (1863), Bliss copy. Frankenstein (1831 text), Jane Eyre (1847) and
// The Great Gatsby (1925) quotations are the ones module 19’s plan uses, cited by chapter.
// VERIFY: Hamlet 3.2 Globe line numbers (1–2, 19–20); the Gettysburg Address wording (Bliss copy); every novel quotation
//         and chapter (Shelley ch. 10, 20; Brontë ch. 23; Fitzgerald ch. 6, 9).
// Written for the module (no plan wording exists): the question bank, the P2 paragraph, the Station 2 model answers,
// Station 3’s two responses, the Activity 2 options beyond the plan’s answer and main wrong option, and the TC2/TC1
// messages for states the plan doesn’t name.

const R = { speech:"3.2.1–2", suit:"3.2.19–20" };
const H = (ref) => "(<i>Hamlet</i> " + ref + ")";
const M1 = "Your essay is the evidence; the defence is the conversation. Speak from cue notes so your eyes can meet your audience.";
const M2 = "Listeners keep up at a comfortable pace, about 130–160 words a minute. Cut words, not breaths.";
const M3 = "A fair challenge deserves a fair answer: concede what’s true, answer what was asked, and show why your reading still stands.";
const M4 = "Paraphrase the question first. If you can’t, you haven’t heard it yet.";
const M5 = "Slides should show what you’re pointing at (one quotation, one image), not what you’re saying.";
const M6 = "“I haven’t explored that; here’s how I’d begin” is honest and still useful. Bluffing costs ethos.";
const M7 = "Pathos makes people care; logos makes them agree. A defence needs both, and ethos holds them together.";
const SET = (id) => " <button type='button' class='btn ghost sm df-setup' data-setup='" + id + "'>Set it up</button>";
const RUB = "<details class='alg'><summary>How your teacher assesses the in-class defence (levels 1–4)</summary><div class='tbl-wrap'><table class='topic-tbl'><thead><tr><th scope='col'>Category</th><th scope='col'>Level 1</th><th scope='col'>Level 2</th><th scope='col'>Level 3</th><th scope='col'>Level 4</th></tr></thead><tbody>" +
  "<tr><td>Knowledge and Understanding</td><td>Little command of the novel or thesis</td><td>Some command; evidence general</td><td>Clear command of the novel, thesis and evidence</td><td>Thorough, nuanced command; evidence precise and well chosen</td></tr>" +
  "<tr><td>Thinking</td><td>Questions dodged or answered off-topic</td><td>Questions answered partly; little evidence</td><td>Questions answered directly with evidence; fair concessions</td><td>Questions used to deepen the argument; graceful concessions; insightful extensions</td></tr>" +
  "<tr><td>Communication</td><td>Reads a script; pace and eye contact impede understanding</td><td>Some structure; uneven pace; frequent reading</td><td>Clear structure (hook, thesis, roadmap); effective pace, pauses and eye contact</td><td>Compelling structure and delivery; voice and gesture purposefully support meaning</td></tr>" +
  "<tr><td>Application</td><td>No connection beyond the essay</td><td>A simple connection</td><td>Connects the argument to wider contexts or other texts</td><td>Original, persuasive extension of the argument to new contexts</td></tr></tbody></table></div></details>";

export default {
  id:"20-isu-oral-defence",
  kind:"topic",
  title:"ISU oral defence",
  topic:"ISU Oral Defence",
  readyTopic:"planning and defending your ISU",
  hero:{
    headline:"Your voice is part of your argument",
    text:"Hamlet coaches the actors to speak lightly and clearly, and to let every gesture fit its word. Your ISU <strong>defence</strong> asks the same: a clear <strong>thesis</strong>, a <strong>roadmap</strong> your listeners can follow, a voice that uses <strong>pace</strong>, <strong>pause</strong> and <strong>emphasis</strong> to show what matters, and answers that meet hard <strong>questions</strong> with honesty and evidence.",
    fig:{ html:"<div class='dfh' id='dfh' role='group' aria-label='Hamlet’s advice to the players appears line by line: “trippingly” bounces lightly across the first line; on “action” a small figure raises a hand and on “word” a speech mark pulses. Then a lectern appears with a thesis card, three cue cards and a question mark waiting.'></div>", caption:"" },
    lines:[
      { t:"Speak the speech, I pray you, as I pronounced it to you, trippingly on the tongue …", bounce:"trippingly", cite:R.speech },
      { t:"suit the action to the word, the word to the action", action:"action", word:"word", cite:R.suit }
    ],
    cite:"<i>Hamlet</i> " + R.speech + ", " + R.suit,
    caption:"This module: plan it, voice it, defend it.",
    listen:"Listen", watch:"Watch again", noVoice:"No local voice on this device: read the lines aloud yourself."
  },
  goals:[
    "I can plan a defence that states my thesis, previews my argument, and fits the time limit.",
    "I can use vocal strategies (pace, pause, emphasis, pitch, volume) and non-verbal cues to make meaning clear.",
    "I can listen actively to a question, paraphrase it, and recognize what kind of question it is.",
    "I can answer hard questions using acknowledge–answer–evidence–return, and concede gracefully when I should.",
    "I can choose rhetorical appeals and audio-visual aids that suit my audience and purpose.",
    "I can reflect on my strengths and next steps as a speaker and listener."
  ],
  start:{
    blocks:[{ title:"Word story: defence", html:"<p><strong><em>Defence</em></strong> comes from the Latin <em>defendere</em>, “to ward off”. Medieval universities trained scholars through the <em>disputatio</em>: a student publicly defended a thesis while opponents raised objections, and the student had to answer each one. Your ISU defence descends from it. <strong><em>Rhetoric</em></strong> is from the Greek <em>rhētorikē technē</em>, “the art of the speaker”: one of the three arts of the trivium.</p><p class='tiny muted'>Word stories are short histories; see a dictionary’s etymology for more.</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Rhetorical appeals", goal:5,
          prompt:"“I’ve read <i>Frankenstein</i> three times and logged every scene where someone looks at the Creature.” Which appeal is this?",
          options:[
            { t:"Ethos (credibility)", ok:true, why:"It shows why you’re worth listening to." },
            { t:"Pathos (emotion)", why:"No feeling is being stirred; it builds trust." },
            { t:"Logos (logic)", why:"It’s not an argument from evidence yet; it’s about you." },
            { t:"Kairos (timing)", why:"Kairos is fitting the moment, not stating credentials." }],
          hints:["Is it about the speaker, the feelings, or the reasoning?", "It establishes the speaker’s knowledge.", "Ethos."] },
        { id:"w2", skill:"Rhetorical appeals", goal:5,
          prompt:"“In all four rejection scenes, the pattern is the same: the Creature speaks, is seen, and is struck.” Which appeal is this?",
          options:[
            { t:"Logos", ok:true, why:"A pattern across evidence is reasoning." },
            { t:"Pathos", why:"The subject is sad, but the move is logical." },
            { t:"Ethos", why:"It isn’t about the speaker’s credibility." },
            { t:"None; it’s just summary", why:"It draws a pattern, which is an argument." }],
          hints:["Does it appeal to reasoning?", "“In all four… the pattern is…”", "Logos."] },
        { id:"w3", skill:"Vocal strategies", goal:2,
          prompt:"What does a short pause just before a key word do?",
          options:[
            { t:"Draws the listener’s attention to that word", ok:true, why:"Silence sets up emphasis." },
            { t:"Makes the speaker seem unprepared", why:"Planned pauses sound confident." },
            { t:"Wastes time", why:"A one-beat pause costs almost nothing and buys attention." },
            { t:"Signals the end of the presentation", why:"Only a long, final pause does." }],
          hints:["What happens to the word right after silence?", "Listeners lean in.", "Emphasis."] },
        { id:"w4", skill:"Vocal strategies", goal:1,
          prompt:"Your defence is 6 minutes. At a comfortable 150 words per minute, about how long should your spoken script be?",
          options:[
            { t:"About 900 words", ok:true, why:"6 × 150 = 900." },
            { t:"About 1500 words", why:"That would need 250 words a minute." },
            { t:"About 600 words", why:"That’s 4 minutes at 150." },
            { t:"As long as your essay", why:"A defence isn’t the essay read aloud." }],
          hints:["Minutes × words per minute.", "6 × 150.", "900."] },
        { id:"w5", skill:"Question types and active listening", goal:3,
          prompt:"“Can you show me where in the novel that happens?” What kind of question is this?",
          options:[
            { t:"Evidence", ok:true, why:"It asks you to point to the text." },
            { t:"Clarification", why:"Clarification asks what you meant, not where it is." },
            { t:"Counterargument", why:"It doesn’t challenge your claim." },
            { t:"Extension", why:"It doesn’t ask you to go beyond your essay." }],
          hints:["What is the questioner asking for?", "A place in the text.", "Evidence."] },
        { id:"w6", skill:"Question types and active listening", goal:3,
          prompt:"A teacher asks a long, two-part question. What’s the best first move?",
          options:[
            { t:"Briefly paraphrase it back to check you’ve understood both parts", ok:true, why:"Paraphrasing shows listening and buys a breath." },
            { t:"Start answering the first part immediately", why:"You may forget the second part, or answer the wrong question." },
            { t:"Say “Great question” and move on", why:"That’s filler, not listening." },
            { t:"Ask them to repeat the whole question", why:"Try a paraphrase first; ask only if you truly missed it." }],
          hints:["How do you prove you heard it?", "Say it back in fewer words.", "Paraphrase."] }
      ],
      refreshers:{
        "Rhetorical appeals":"<strong>Ethos:</strong> why you’re credible. <strong>Pathos:</strong> why listeners should care. <strong>Logos:</strong> why your claim follows from the evidence. <strong>Kairos:</strong> fitting the moment and audience.",
        "Vocal strategies":"<strong>Pace:</strong> about 130–160 words per minute. <strong>Pause:</strong> before key words and after big claims. <strong>Emphasis:</strong> stress the words that carry meaning. <strong>Pitch:</strong> vary it to avoid a monotone. <strong>Volume:</strong> reach the back row.",
        "Question types and active listening":"<strong>Clarification:</strong> what do you mean? <strong>Evidence:</strong> where does it show? <strong>Counterargument:</strong> isn’t it really…? <strong>Extension:</strong> what about…? Paraphrase before answering."
      }
    }
  },
  explore:{
    heading:"Rehearsal coach",
    intro:"Plan your defence, mark it for your voice, and drill the questions you’re most afraid of. Everything stays on this device.",
    modes:[{ id:"plan", t:"Plan" }, { id:"rehearse", t:"Rehearse" }, { id:"drill", t:"Question drill" }],
    novels:[
      { id:"fr", t:"<i>Frankenstein</i>", title:"Frankenstein", author:"Mary Shelley" },
      { id:"je", t:"<i>Jane Eyre</i>", title:"Jane Eyre", author:"Charlotte Brontë" },
      { id:"gg", t:"<i>The Great Gatsby</i>", title:"The Great Gatsby", author:"F. Scott Fitzgerald" },
      { id:"my", t:"My novel" }
    ],
    segs:[
      { id:"open", t:"Opening (hook)", def:30 },
      { id:"thesis", t:"Thesis and roadmap", def:20 },
      { id:"c1", t:"Claim 1", def:60, claim:true },
      { id:"c2", t:"Claim 2", def:60, claim:true },
      { id:"c3", t:"Claim 3", def:60, claim:true, opt:true },
      { id:"close", t:"Why it matters / closing", def:30 },
      { id:"invite", t:"Invitation to questions", def:10 }
    ],
    layouts:[{ id:"quote", t:"Quotation" }, { id:"image", t:"Image placeholder" }, { id:"title", t:"Title" }],
    review:["Eye contact", "Pace", "Pauses at key moments", "Varied pitch", "Gestures that fit the words", "Cue notes, not reading"],
    levels:["Not yet", "Getting there", "Got it"],
    tools:[{ id:"pause", t:"Pause /" }, { id:"stress", t:"Stress (underline)" }, { id:"slow", t:"Slow down ~" }],
    para:"Shelley never lets us see the Creature the way the villagers do. We hear him first. And by the time anyone screams, we already know what they refuse to know: that the monster has been listening, learning, and hoping.",
    recLabel:"Not saved. Gone when you leave.",
    noVoice:"No local voice on this device, so Listen is hidden: read it aloud yourself and use the timing marks.",
    types:[{ id:"clar", t:"Clarification" }, { id:"ev", t:"Evidence" }, { id:"counter", t:"Counterargument" }, { id:"ext", t:"Extension" }],
    moves:[{ id:"ack", t:"Acknowledge", role:"syntax" }, { id:"ans", t:"Answer", role:"figure" }, { id:"ev", t:"Evidence", role:"image" }, { id:"ret", t:"Return", role:"ret" }],
    bank:[
      { id:"q1", type:"clar", t:"What exactly do you mean by the key word in your thesis?" },
      { id:"q2", type:"clar", t:"When you say [claim], what do you mean?" },
      { id:"q3", type:"clar", t:"Can you put your thesis about [title] into one simpler sentence?" },
      { id:"q4", type:"clar", t:"Is your argument about what [author] intended, or about what the text does?" },
      { id:"q5", type:"clar", t:"Could you explain your roadmap again? I lost the second step." },
      { id:"q6", type:"clar", t:"Which character’s point of view do you mean in your second claim?" },
      { id:"q7", type:"ev", t:"Where in [title] do you see your claim most clearly?" },
      { id:"q8", type:"ev", t:"Can you read us the line that best supports [claim]?" },
      { id:"q9", type:"ev", t:"Which scene in [title] would you point to first?" },
      { id:"q10", type:"ev", t:"Is there a pattern across the novel, or just one moment?" },
      { id:"q11", type:"ev", t:"What does [author] actually write at that moment?" },
      { id:"q12", type:"ev", t:"Which detail in the text convinced you of this?" },
      { id:"q13", type:"counter", t:"Isn’t your thesis just your opinion?" },
      { id:"q14", type:"counter", t:"Couldn’t a reader argue the opposite about [title]?" },
      { id:"q15", type:"counter", t:"Doesn’t the ending of [title] work against your reading?" },
      { id:"q16", type:"counter", t:"Aren’t you reading too much into one scene?" },
      { id:"q17", type:"counter", t:"Wouldn’t [author]’s first readers have seen it differently?" },
      { id:"q18", type:"counter", t:"Isn’t the narrator unreliable, which weakens your evidence?" },
      { id:"q19", type:"ext", t:"How might your reading apply to the world today?" },
      { id:"q20", type:"ext", t:"Would your argument hold for another book by [author]?" },
      { id:"q21", type:"ext", t:"How might a film adaptation of [title] change your argument?" },
      { id:"q22", type:"ext", t:"What would a critic you read say about your thesis?" },
      { id:"q23", type:"ext", t:"If you had another month, where would you take this argument?" },
      { id:"q24", type:"ext", t:"How does [title] compare with another text from this course?" }
    ],
    typeFb:{ clar:"It asks what you <em>mean</em>.", ev:"It asks <em>where</em> in the text.", counter:"It offers a competing reading: “isn’t it…?”", ext:"It asks you to go <em>further</em>: “what about…?”" },
    tc3q:"Isn’t the Creature just a murderer? Why should we sympathize with him at all?",
    tc3chips:[
      { id:"c1", t:"That’s a fair challenge: he does kill, and the novel never hides it." },
      { id:"c2", t:"No, you’re wrong; he’s innocent." },
      { id:"c3", t:"My argument isn’t that he’s innocent, but that Shelley shows us how he became violent." },
      { id:"c4", t:"Each killing follows an abandonment: William dies after the cottagers drive the Creature away and a man shoots him for saving a girl from the river." },
      { id:"c5", t:"So the question the novel leaves is not whether he’s guilty but who made him so, which is exactly my thesis about rejection as a verdict." },
      { id:"c6", t:"Maybe you’re right and my thesis doesn’t work." }
    ],
    tc3key:{ answer:["c1", "c3", "c4", "c5"] },
    tc1key:{ answer:{ total:[330, 390], open:[15, 45], thesis:[30, 60], claim:[60, 120], close:[20, 60], invite:[5, 20] } },
    p1:{ sentence:"We hear the Creature before anyone sees him.", pauseBefore:1 },
    p2:{ para:"In Frankenstein, the Creature’s first words are not a threat but a plea. He watches the cottagers for months, learns their language, and rehearses what he will say before he dares to knock. When the old man listens, there is hope. When the young people see him, there is only fear, and the door closes on everything he has learned." },
    p4:{ q:"Isn’t your thesis just your opinion?", a1:"No, it’s not, it’s in the book.", a2:"Every reading is an interpretation, so here’s why mine is the strongest the text supports: in all four rejection scenes…" },
    aha:"A defence is designed <strong>time first</strong>: the clock decides how much you can say, so you choose the <em>best</em> evidence, not all of it. Then the voice and the answers carry the argument.",
    predIntro:"Make a prediction first. Then the coach plays it out: listen and compare, and watch the audience.",
    predictions:[
      { id:"p1",
        prompt:"Rehearse mode: “We hear the Creature before anyone sees him.” Version 1 is read straight through; version 2 pauses for one beat before “hear”. What changes?",
        options:[{ t:"“Hear” stands out; listeners notice the contrast with “sees”", ok:true }, { t:"Nothing; pauses don’t change meaning" }, { t:"It sounds unprepared" }, { t:"It makes the sentence harder to follow" }],
        explain:"A planned pause is a spotlight." },
      { id:"p2",
        prompt:"The same 60-word paragraph is read at 150 words per minute, then at 200. Predict how much listeners remember.",
        options:[{ t:"Less at 200 wpm; they can’t keep up with the ideas", ok:true }, { t:"More at 200 wpm, because more energy" }, { t:"The same" }, { t:"More at 200 wpm, because it’s shorter" }],
        explain:"Speed feels efficient to the speaker and exhausting to the listener. Cut words, not breaths." },
      { id:"p3",
        prompt:"Two stills. In one, the speaker’s eyes are on a full script; in the other, on the audience, with a cue card in hand. Which speaker will the audience trust more on a hard question?",
        options:[{ t:"The one using cue cards and meeting their eyes", ok:true }, { t:"The one reading the full script, who looks more prepared" }, { t:"No difference" }, { t:"The script reader, because nothing will be forgotten" }],
        explain:"Reading a script word for word turns a conversation into a recital." },
      { id:"p4",
        prompt:"Question drill, a counterargument: “Isn’t your thesis just your opinion?” Answer 1: “No, it’s not, it’s in the book.” Answer 2: “Every reading is an interpretation, so here’s why mine is the strongest the text supports: in all four rejection scenes…” Which builds more ethos?",
        options:[{ t:"Answer 2", ok:true }, { t:"Answer 1" }, { t:"Both equally" }, { t:"Neither" }],
        explain:"Acknowledging the fair point and then answering with evidence turns a challenge into your stage." }
    ],
    chalIntro:"Use the coach to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1,
        prompt:"<strong>Budget a 6-minute defence.</strong> In Plan mode, with the time limit at 6 minutes, set the seconds for each segment (2 or 3 claims)." + SET("tc1"),
        why:"Every segment has room to work, and the whole thing fits the clock. That’s a defence designed time first.",
        msgs:{ over:"Over time. Trim a claim, not the thesis.", under:"Under time. Give your claims room to show their evidence.", thesis:"Your listeners need the map before the journey.", thesisHi:"The thesis and roadmap need 30–60 s; past a minute, the map becomes the journey.", claim:"Under a minute, a claim can’t show its evidence.", claimHi:"Over two minutes, a claim stops being the best evidence and becomes all of it.", open:"The hook is eating your argument.", openLo:"Give the hook at least 15 s to land.", close:"Closing needs 20–60 s: long enough to land, short enough to leave time for questions.", invite:"Invite questions in 5–20 s.", limit:"Set the time limit to 6 minutes first." },
        hints:["Start with the claims: about a minute and a half each.", "Thesis and roadmap need 30–60 s, closing 20–60 s.", "Try 30 / 45 / 85 / 85 / 85 / 30 / 10."] },
      { id:"tc2", goal:2,
        prompt:"<strong>Mark this paragraph for your voice.</strong> In Rehearse mode, with the practice paragraph, mark the stresses and pauses that make its meaning audible (no more than 6 stresses)." + SET("tc2"),
        why:"See and hear now contrast out loud, “refuse” lands, and the colon’s drumroll sets up the reveal.",
        msgs:{ many:"When everything is stressed, nothing is.", colon:"The colon is a drumroll. Let it sound.", hear:"The paragraph turns on see vs hear. Make the contrast audible.", see:"The paragraph turns on see vs hear. Make the contrast audible: stress both.", refuse:"“refuse” is the verdict in the sentence. Lean on it.", hoping:"Hold one beat before “and hoping”: the last word is the one that hurts." },
        hints:["Which two verbs contrast?", "Where does the sentence hold its breath before the reveal?", "Stress see, hear and refuse; pause after “know:” and before “and hoping”."] },
      { id:"tc3", goal:4, stretch:true,
        prompt:"<strong>Build an answer to a counterargument question.</strong> In Question drill, use the answer builder: “Isn’t the Creature just a murderer? Why should we sympathize with him at all?” Put the right chips in order." + SET("tc3"),
        why:"Acknowledge, answer, evidence, return: a fair concession, the question actually answered, the text, and the thesis last, where listeners remember it.",
        msgs:{ c2:"That’s a wall, not an answer.", c6:"Conceding a point isn’t surrendering your thesis.", c4:"Where’s the text? An answer without evidence is an opinion.", c5:"Return to your thesis at the end; that’s where listeners remember it.", empty:"Tap chips to build your answer.", order:"Four moves, in order: acknowledge, answer, evidence, return." },
        hints:["Four moves: acknowledge, answer, evidence, return.", "Which chip admits what’s true without giving up?", "c1, c3, c4, c5."] }
    ]
  },
  part3:{
    slug:"hard-question", name:"Hard questions", heading:"Handling the hard question",
    intro:"Hard questions test whether you can listen and respond in the moment. These four stations work on that: listen first, use the four moves, say “I don’t know” well, and let your body show calm. How you answer is part of what your answer means.",
    stations:{
      s1:{ q:"So you’re saying the Creature is the victim, but then wouldn’t that mean Victor is the villain, and if so why does Shelley give him the whole frame narrative, and doesn’t that make us side with him?",
        options:[
          { t:"“You’re asking whether giving Victor the frame makes us side with him, which would undercut my reading of the Creature as wronged.”", ok:true, why:"Right. A good paraphrase names the real challenge in one sentence." },
          { t:"“You think Victor is the villain.”", why:"Too narrow. A good paraphrase names the real challenge in one sentence." },
          { t:"“You’re asking about the narrative frame.”", why:"Too vague. A good paraphrase names the real challenge in one sentence." },
          { t:"“You disagree with me.”", why:"That’s not a paraphrase. A good paraphrase names the real challenge in one sentence." }] },
      s2:{ answers:[
        { id:"a", t:"Concede and narrow", parts:[
          { m:"ack", t:"Yes, the frame is Victor’s, and Shelley lets him plead his case at length." },
          { m:"ans", t:"But notice it’s told to Walton, who is about to repeat Victor’s mistake, so the frame puts Victor on trial, not on a throne." },
          { m:"ev", t:"And inside it, the Creature’s own story takes over: “I was benevolent and good; misery made me a fiend” (Shelley, ch. 10)." },
          { m:"ret", t:"So the frame doesn’t make us side with Victor; it makes us judge him, which is exactly my reading of the Creature as wronged." }] },
        { id:"b", t:"Reframe respectfully", parts:[
          { m:"ack", t:"That’s a real question, because Victor does narrate most of the novel." },
          { m:"ans", t:"I’d put it slightly differently: the frame lets us watch Victor fail to listen." },
          { m:"ev", t:"Even as he tells it, he repeats the Creature’s plea word for word, “Make me happy, and I shall again be virtuous” (Shelley, ch. 10), and still, in the end, breaks his promise to him." },
          { m:"ret", t:"So the frame works against Victor, and that supports my reading of the Creature as wronged." }] },
        { id:"c", t:"Turn into extension", parts:[
          { m:"ack", t:"That’s exactly where my argument goes next." },
          { m:"ans", t:"If Victor holds the frame, the real question becomes whose story we trust, and I think Shelley makes us trust the voice he tried to silence." },
          { m:"ev", t:"The novel ends not with Victor but with the Creature speaking to Walton over Victor’s body." },
          { m:"ret", t:"So the frame hands the story back to the Creature, which strengthens my thesis instead of undercutting it." }] }
      ], tagIdx:0, ok:"✓ All four moves found. Now open the other two answers: same moves, different strategies.", bad:"Not yet. Ask of each sentence: does it admit, reply, point to the text, or come back to the thesis?" },
      s3:{ q:"How would your reading change if you compared <i>Frankenstein</i> with Mary Shelley’s later novel <i>The Last Man</i>?",
        r1:"Well, that’s a really interesting question about <i>The Last Man</i>. I think it would probably be quite similar, because Shelley’s novels are all about similar things, so my reading would basically apply there too, in a lot of ways.",
        r2:"I haven’t explored that directly; here’s how I’d begin: I’d look at the scenes where a survivor is left with no one to listen, because my thesis predicts that Shelley treats isolation as a verdict passed by others.",
        why:[
          { t:"It’s honest about what you know, and it still shows how you’d think the question through.", ok:true, why:"Right. An honest bridge keeps ethos: it trades a bluff for a method." },
          { t:"It sounds more confident.", why:"Not quite. The bluff sounds confident too; listeners trust the one that’s honest and specific." },
          { t:"It’s longer.", why:"Not quite. Length isn’t the point; the honest bridge names what you’d examine and why." },
          { t:"It avoids the question.", why:"Not quite. It answers the question by naming where you’d start." }],
        pickOk:"Right: the honest bridge (response 2). Now say why.", pickBad:"Not quite. Response 1 repeats the question, stays vague and cites nothing. Bluffing costs ethos." },
      s4:{ stances:[
        { id:"cross", t:"Arms crossed" },
        { id:"open", t:"Hands loose and open" },
        { id:"notes", t:"Eyes on notes" },
        { id:"eyes", t:"Eyes on the questioner" }],
        reads:[{ id:"defensive", t:"Defensive" }, { id:"open", t:"Open" }, { id:"hiding", t:"Hiding" }, { id:"engaged", t:"Engaged" }],
        key:{ answer:{ cross:"defensive", open:"open", notes:"hiding", eyes:"engaged" } },
        tip:"Breathe before you answer. A two-second pause after a hard question reads as thoughtfulness, not panic." }
    },
    blocks:[{ title:"Craft → meaning", html:"<p>How you answer <em>is</em> part of your argument. A calm, fair, evidence-based answer says your reading can survive pressure; that’s the strongest proof a thesis can have.</p>" }],
    quickCheck:{ title:"Hard questions: quick check", summary:"Hard questions quick check", items:[
      { id:"q1", goal:3, prompt:"The best first move when you’re unsure what was asked?",
        choices:[{ t:"Paraphrase it back", ok:true, fb:"Right. Say it back in one sentence, then answer." }, { t:"Answer what you prepared", fb:"Check the target before you aim." }, { t:"Say “Great question”", fb:"Check the target before you aim." }, { t:"Change the subject", fb:"Check the target before you aim." }] },
      { id:"q2", goal:4, prompt:"Which move admits what’s fair in a challenge?",
        choices:[{ t:"Acknowledge", ok:true, fb:"Right. Acknowledge first; it lowers the temperature." }, { t:"Return", fb:"Acknowledge first; it lowers the temperature." }, { t:"Evidence", fb:"Acknowledge first; it lowers the temperature." }, { t:"Answer", fb:"Acknowledge first; it lowers the temperature." }] },
      { id:"q3", goal:4, prompt:"You don’t know the answer to an extension question. The best response?",
        choices:[{ t:"Name what you’d examine and why", ok:true, fb:"Right. An honest bridge keeps ethos." }, { t:"Invent a confident answer", fb:"An honest bridge keeps ethos." }, { t:"Refuse to answer", fb:"An honest bridge keeps ethos." }, { t:"Repeat your thesis louder", fb:"An honest bridge keeps ethos." }] },
      { id:"q4", goal:2, prompt:"What does a two-second pause before a hard answer signal?",
        choices:[{ t:"Thoughtfulness", ok:true, fb:"Right. A breath is composure, not weakness." }, { t:"Panic", fb:"A breath is composure, not weakness." }, { t:"Disrespect", fb:"A breath is composure, not weakness." }, { t:"That you didn’t hear", fb:"A breath is composure, not weakness." }] }
    ] },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class='steal-line'>“The world will little note, nor long remember what we say here, but it can never forget what they did here.”</p><p class='eng-cite'>Abraham Lincoln, Gettysburg Address, 1863</p><p><strong>What makes it work:</strong> antithesis. “What we say” is balanced against “what they did”, and “little note, nor long remember” against “never forget”. The contrast does the persuading.</p><p><strong>Your turn:</strong> write the closing line of your defence as a balanced contrast. For example: “Shelley’s question isn’t what the Creature is, but what we make of him.” Save it to your commonplace book.</p>",
      prompt:"My closing line, as a balanced contrast" }]
  },
  practice:{
    activities:[
      { id:"name", type:"sorter", title:"Name the question", summary:"Name the question", goal:3, noun:"question", txt:true,
        instruction:"Sort each question into the kind of question it is.",
        boxes:[{ id:"clar", label:"Clarification", sub:"what do you mean?" }, { id:"ev", label:"Evidence", sub:"where?" }, { id:"counter", label:"Counterargument", sub:"isn’t it…?" }, { id:"ext", label:"Extension", sub:"what about…?" }],
        items:[
          { id:"n1", t:"“What do you mean by ‘verdict’ in your thesis?”", answer:"clar", why:"It asks what a word in your thesis means.", hints:["Is it asking what, where, isn’t-it, or what-about?", "Underline the key verb or phrase: “What do you mean”.", "Clarification: it asks what you meant by a term."] },
          { id:"n2", t:"“Where does the novel show the cottagers judging his face, not his words?”", answer:"ev", why:"It asks where in the text.", hints:["Is it asking what, where, isn’t-it, or what-about?", "Underline the key verb or phrase: “Where does the novel show”.", "Evidence: it asks for a place in the text."] },
          { id:"n3", t:"“Couldn’t the Creature’s crimes mean he was always dangerous?”", answer:"counter", why:"It offers a competing reading.", hints:["Is it asking what, where, isn’t-it, or what-about?", "Underline the key verb or phrase: “Couldn’t… mean”.", "Counterargument: it proposes a different reading."] },
          { id:"n4", t:"“How might your reading apply to the way we treat newcomers today?”", answer:"ext", why:"It takes the argument beyond the novel.", hints:["Is it asking what, where, isn’t-it, or what-about?", "Underline the key verb or phrase: “apply to… today”.", "Extension: it asks you to take the argument further."] },
          { id:"n5", t:"“When you say ‘care’, do you mean love or responsibility?”", answer:"clar", why:"It asks what a term means.", wrong:{ ev:"It asks about the meaning of your term, not about the text." }, hints:["Is it asking what, where, isn’t-it, or what-about?", "Underline the key verb or phrase: “do you mean”.", "Clarification: it asks which meaning of “care” you intend."] },
          { id:"n6", t:"“Which line best supports your second claim?”", answer:"ev", why:"It asks you to point to the text.", hints:["Is it asking what, where, isn’t-it, or what-about?", "Underline the key verb or phrase: “Which line”.", "Evidence: it asks for a line from the text."] },
          { id:"n7", t:"“Doesn’t Victor’s suffering make him sympathetic too?”", answer:"counter", why:"It offers a competing reading.", hints:["Is it asking what, where, isn’t-it, or what-about?", "Underline the key verb or phrase: “Doesn’t… make”.", "Counterargument: it pushes back on your reading."] },
          { id:"n8", t:"“Would your thesis hold for the 1818 edition as well as the 1831?”", answer:"ext", why:"It asks you to take the argument further.", wrong:{ counter:"It doesn’t dispute you. It asks you to take the argument further." }, hints:["Is it asking what, where, isn’t-it, or what-about?", "Underline the key verb or phrase: “Would your thesis hold for”.", "Extension: it asks whether the argument reaches another edition."] },
          { id:"n9", t:"“Isn’t the frame narrative designed to make us side with Victor?”", answer:"counter", why:"It offers a competing reading.", wrong:{ clar:"It isn’t asking what you meant; it’s offering a competing reading." }, hints:["Is it asking what, where, isn’t-it, or what-about?", "Underline the key verb or phrase: “Isn’t… designed to”.", "Counterargument: it offers a competing reading of the frame."] },
          { id:"n10", t:"“Can you read us the moment you’re describing?”", answer:"ev", why:"It asks for the text itself.", hints:["Is it asking what, where, isn’t-it, or what-about?", "Underline the key verb or phrase: “read us the moment”.", "Evidence: it asks you to show the text."] }
        ] },
      { id:"pressure", type:"mc", title:"Defence under pressure", summary:"Defence under pressure", star:true, goal:[1, 2, 4, 5],
        instruction:"Choose the best move in each situation. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        items:[
          { id:"s1", goal:4, prompt:"A questioner asks: “Isn’t your reading just your opinion?”",
            options:[
              { t:"“Every reading is an interpretation. Here’s why mine is the one the text best supports: in all four rejection scenes, the verdict comes before any act.”", ok:true, why:"It concedes the fair point and answers with evidence." },
              { t:"“Yes, it’s my opinion, so it can’t be wrong.”", why:"That ends the conversation and gives up logos." },
              { t:"“No. It’s simply what the book says.”", why:"A wall, not an answer: concede what’s true, then show the evidence." },
              { t:"“Good question. Anyway, my third claim…”", why:"That dodges the question asked." }],
            hints:["Is there anything fair in the challenge?", "Concede it, then reach for the text.", "Every reading is an interpretation; here’s the evidence for mine."] },
          { id:"s2", goal:1, prompt:"Your script is 1050 words; the limit is 6 minutes at 150 wpm. What do you do?",
            options:[
              { t:"Cut about 150 words: 6 × 150 = 900.", ok:true, why:"1050 − 900 = 150." },
              { t:"Speak faster to fit it in.", why:"That’s 175 wpm, and listeners fall behind." },
              { t:"Cut about 500 words to be safe.", why:"That leaves 550 words, under 4 minutes: too short." },
              { t:"Leave it; the limit is only a guide.", why:"Running over cuts into the questions, which carry the defence." }],
            hints:["How many words fit in 6 minutes?", "6 × 150 = 900.", "1050 − 900 = 150: cut about 150 words."] },
          { id:"s3", goal:4, prompt:"A questioner says, “I didn’t follow your second claim.”",
            options:[
              { t:"Restate the claim in one sentence, then give the single clearest example.", ok:true, why:"New, simpler words plus one example." },
              { t:"Repeat the whole section word for word.", why:"The same words won’t land better the second time." },
              { t:"Say it was in the essay.", why:"The defence is the conversation; the questioner is asking you now." },
              { t:"Move on to the third claim.", why:"An unanswered question looks like a dodge." }],
            hints:["Why didn’t it land the first time?", "Use fewer, plainer words.", "One-sentence restatement, one clear example."] },
          { id:"s4", goal:5, prompt:"★ Choose the best slide for claim 2.",
            options:[
              { t:"One quotation, large, with its key word highlighted; you speak the analysis.", ok:true, why:"One idea on the slide; the analysis is yours to say." },
              { t:"The full paragraph of your essay on the slide.", why:"The audience reads instead of listening." },
              { t:"Five quotations in small type, so nothing is missed.", why:"Clutter: the audience can’t tell which one matters." },
              { t:"A blank slide with only the word “Claim 2”.", why:"It shows nothing to point at; one quotation would." }],
            hints:["What should the audience look at while you talk?", "One thing to point at.", "One large quotation with its key word highlighted."] },
          { id:"s5", goal:3, prompt:"★ A two-part question: “Is Victor the villain, and if not, who is?”",
            options:[
              { t:"Signpost: “Two parts: first, Victor isn’t a simple villain because…; second, the novel locates blame in…”, then answer both in order.", ok:true, why:"Naming the parts shows you heard both, and keeps you on track." },
              { t:"Answer only the more interesting part.", why:"Unanswered halves look like dodges." },
              { t:"Ask the questioner to choose one part.", why:"You can answer both; name the parts and take them in order." },
              { t:"Answer the second part first, without saying so.", why:"Listeners lose track; signpost the parts out loud." }],
            hints:["How many questions are inside that one?", "Name the parts before answering.", "Signpost, then answer both."] },
          { id:"s6", goal:2, prompt:"★ Your defence will be on video, not in a room. The best adjustment?",
            options:[
              { t:"Look at the camera when making key points, slow down slightly, and signpost more explicitly, since you can’t read the room.", ok:true, why:"Camera contact, pace and signposts replace what the room would give you." },
              { t:"Read your script; no one can see your notes.", why:"Eyes dropping to a script read clearly on camera." },
              { t:"Speak faster, because video feels slow.", why:"Speed fights understanding on video too." },
              { t:"Change nothing; a defence is a defence.", why:"Kairos: fit the moment. Video loses the room, so make up for it." }],
            hints:["What’s lost on video?", "Eye contact means camera contact.", "Camera, pace, signposts."] }
        ] },
      { id:"spot", type:"custom", title:"Spot the Error", summary:"Spot the error", student:"Yannick", goal:[1, 3, 4],
        instruction:"Yannick recorded three parts of a practice defence on <i>The Great Gatsby</i>. Each has one flaw. Tap the sentence where the <strong>first</strong> flaw appears, then choose the fix.",
        how:"",
        problems:[
          { id:"e1", goal:1, task:"Opening",
            steps:["“Picture a man alone on his lawn at night, reaching toward a light across the water.”", "“My thesis is that Fitzgerald presents Gatsby’s dream as a faith that survives by refusing evidence.”", "“I’ll show this through the parties, the green light, and the final image of the current.”", "“So now I’m going to read my essay, starting from the introduction.”", "“Paragraph one begins…”"],
            answer:3, stepFb:["A vivid hook. Keep checking.", "A clear thesis.", "A roadmap with three stops.", "", "This follows from the mistake in sentence 4."],
            fixes:[{ t:"“Speak each claim from a cue card: one claim, the best quotation, and why it matters, with eyes on the audience.”", ok:true, why:"The essay is the evidence; the defence is the conversation." }, { t:"“Read faster so the whole essay fits.”", why:"That doubles the problem." }, { t:"“Put the essay on slides and read those.”", why:"That’s still a recital." }, { t:"“Sentence 4 is fine.”", why:"A defence discusses the argument; it doesn’t recite the essay." }],
            hints:["Which sentence turns a conversation into a recital?", "A defence isn’t a reading.", "Sentence 4."] },
          { id:"e2", goal:3, task:"Answer to “Where does the novel show Gatsby refusing evidence?”",
            steps:["“You’re asking for the moment the dream meets the facts and won’t bend.”", "“That’s a really good question.”", "“Fitzgerald himself had a complicated relationship with wealth and with Zelda.”", "“So that’s why the dream matters to him.”"],
            answer:2, stepFb:["An accurate paraphrase.", "Brief courtesy; fine.", "", "This follows from the drift in sentence 3."],
            fixes:[{ t:"“Point to the text: when Nick warns that the past can’t be repeated, Gatsby insists, ‘Why of course you can!’ (Fitzgerald, ch. 6).”", ok:true, why:"It answers the question asked: where in the novel." }, { t:"“Add more biography about Fitzgerald.”", why:"That answers a question no one asked." }, { t:"“Say ‘I’m not sure’ and stop.”", why:"You do have evidence; use it." }, { t:"“Sentence 3 is fine.”", why:"The question asked <em>where in the novel</em>; biography isn’t the novel." }],
            hints:["What did the question ask for?", "A place in the text.", "Sentence 3."] },
          { id:"e3", goal:4, task:"Answer to “Doesn’t Daisy’s choice prove the dream was simply foolish?”",
            steps:["“That’s fair; Daisy doesn’t choose Gatsby, and the novel lets that sting.”", "“So you’re right, and my whole thesis falls apart.”", "“I guess the dream was just foolish.”", "“Thanks for the question.”"],
            answer:1, stepFb:["A clean acknowledgement.", "", "This follows from the surrender in sentence 2.", "Courteous, but the answer is already lost."],
            fixes:[{ t:"Concede the point, then answer: “But my thesis is that the dream survives <em>by refusing</em> evidence; Daisy’s choice is the evidence it refuses, which is why the final image is of boats still beating on.”", ok:true, why:"Concede the point, not the argument." }, { t:"“Insist Daisy secretly loved him more.”", why:"Arguing against the text loses logos." }, { t:"“Change the subject to the parties.”", why:"That dodges the question." }, { t:"“Sentence 2 is fine.”", why:"Acknowledging a point isn’t the same as abandoning your thesis." }],
            hints:["Where does fair acknowledgement turn into surrender?", "Concede the point, not the argument.", "Sentence 2."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"When you heard your own voice (or read your timing data), what surprised you most about how you speak?" },
      { id:"j2", q:"In your own words, why is acknowledging a fair objection stronger than ignoring it?" },
      { id:"j3", q:"Explain to a friend how you’d handle a question you can’t answer, without bluffing." },
      { id:"j4", q:"What’s your biggest delivery habit to work on (pace, eye contact, filler words, reading), and what exactly will you practise before the real defence?" }
    ],
    blocks:[
      { title:"Commonplace book", html:"<p>Save the line from your novel you most want to say aloud in your defence, and mark where you’ll pause (type a / at each pause).</p><div id='df-cp'></div>" }
    ],
    art:{
      intro:"Write one principle about speaking or answering that you now believe. Choose a line from this module (Hamlet’s advice, Lincoln’s antithesis, or a model answer) that shows it, and write your own spoken-style sentence that uses it.",
      placeholder:"e.g. Answer the question asked, then return to your thesis.",
      examples:["Speak the speech, I pray you, as I pronounced it to you, trippingly on the tongue", "suit the action to the word, the word to the action", "The world will little note, nor long remember what we say here, but it can never forget what they did here.", "I haven’t explored that directly; here’s how I’d begin"]
    },
    artSamples:[
      { p:"Answer the question asked, then return to your thesis.", m:"“So the frame doesn’t make us side with Victor; it makes us judge him, which is exactly my reading of the Creature as wronged.” (model answer)" },
      { p:"Pause before the word you want remembered.", m:"“suit the action to the word, the word to the action” " + H(R.suit) }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:5,
        a:{ prompt:"“In every one of the six scenes where Gatsby mentions Daisy, he speaks of the past.” Which appeal does this rely on most?",
          options:[
            { t:"Logos", ok:true, why:"A pattern across the evidence is reasoning." },
            { t:"Pathos", why:"The topic is emotional, but the move is logical." },
            { t:"Ethos", why:"It’s not about the speaker’s credibility." },
            { t:"Kairos", why:"It’s not about timing or occasion." }] },
        b:{ prompt:"“Having taught myself to read the novel’s drafts, I noticed details most readers miss.” Which appeal does this rely on most?",
          options:[
            { t:"Ethos", ok:true, why:"It establishes the speaker’s credibility." },
            { t:"Logos", why:"No reasoning from evidence yet." },
            { t:"Pathos", why:"No emotion is being stirred." },
            { t:"Kairos", why:"It’s not about the moment." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Deliberately slowing down for an important sentence is a change in…",
          options:[
            { t:"pace", ok:true, why:"Pace is speed." },
            { t:"pitch", why:"Pitch is how high or low the voice is." },
            { t:"volume", why:"Volume is loudness." },
            { t:"posture", why:"Posture is non-verbal." }] },
        b:{ prompt:"Letting your voice rise and fall to avoid a monotone is a change in…",
          options:[
            { t:"pitch", ok:true, why:"Pitch is how high or low the voice is." },
            { t:"pace", why:"Pace is speed." },
            { t:"volume", why:"Volume is loudness." },
            { t:"gesture", why:"Gesture is non-verbal." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"“How might your reading change if the novel were told by Daisy?” What type of question is this?",
          options:[
            { t:"Extension", ok:true, why:"It asks you to take the argument further." },
            { t:"Evidence", why:"It doesn’t ask where in the text." },
            { t:"Clarification", why:"It doesn’t ask what you meant." },
            { t:"Counterargument", why:"It doesn’t dispute your claim." }] },
        b:{ prompt:"“By ‘verdict’, do you mean a legal judgment or just a social one?” What type of question is this?",
          options:[
            { t:"Clarification", ok:true, why:"It asks what you meant by a term." },
            { t:"Extension", why:"It doesn’t go beyond your essay." },
            { t:"Evidence", why:"It doesn’t ask where." },
            { t:"Counterargument", why:"It doesn’t propose a competing reading." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A teacher asks: “Doesn’t Jane’s leaving Thornfield show principle defeating passion, the opposite of your thesis?” Which answer is strongest?",
          options:[
            { t:"“That’s a fair reading of the moment. But I’d argue her leaving is itself passionate: she says she is ‘a free human being with an independent will’ (Brontë, ch. 23), and she chooses herself as fiercely as she once chose him. So passion isn’t defeated; it’s redirected.”", ok:true, why:"Acknowledge, answer, evidence, return." },
            { t:"“No, it doesn’t. My thesis is right.”", why:"A wall, not an answer." },
            { t:"“You’re right; my thesis doesn’t hold.”", why:"Conceding the point isn’t conceding the argument." },
            { t:"“I’m not sure, but I think the novel is really about love.”", why:"That’s a vague bluff with no evidence." }] },
        b:{ prompt:"A teacher asks: “Doesn’t Victor’s suffering make him as sympathetic as the Creature?” Which answer is strongest?",
          options:[
            { t:"“He does suffer, and Shelley lets us feel it. But my claim is about responsibility, not sympathy: each of the Creature’s crimes follows an abandonment Victor chose. So the novel can grieve for Victor and still judge him.”", ok:true, why:"Acknowledge, answer, evidence, return." },
            { t:"“No. Victor is just a villain.”", why:"A wall, not an answer. " + M3 },
            { t:"“You’re right; I should change my thesis.”", why:"Conceding the point isn’t conceding the argument. " + M3 },
            { t:"“I haven’t thought about Victor much.”", why:"That’s honest, but it offers no path forward." }] } },
      { id:"t2", cat:"T", goal:1,
        a:{ prompt:"Your limit is 6 minutes and you speak at about 150 words per minute. Your script is 1200 words. How many words should you cut?",
          options:[
            { t:"About 300 words", ok:true, why:"6 × 150 = 900; 1200 − 900 = 300." },
            { t:"About 150 words", why:"That leaves 1050 words, 7 minutes at 150 wpm." },
            { t:"None; speak faster", why:"1200 words in 6 minutes is 200 wpm." },
            { t:"About 600 words", why:"That cuts to 600 words, 4 minutes: too short." }] },
        b:{ prompt:"Your limit is 5 minutes and you speak at about 140 words per minute. Your script is 840 words. How many words should you cut?",
          options:[
            { t:"About 140 words", ok:true, why:"5 × 140 = 700; 840 − 700 = 140." },
            { t:"About 70 words", why:"That leaves 770 words, 5.5 minutes." },
            { t:"None; speak faster", why:"840 words in 5 minutes is 168 wpm." },
            { t:"About 280 words", why:"That leaves 560 words, 4 minutes." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"Hamlet tells the players to “suit the action to the word, the word to the action” " + H(R.suit) + ". Which delivery choice for your line “and the light goes out” best follows it?",
          options:[
            { t:"A small, slow lowering of the hand as your voice drops on “out”", ok:true, why:"The gesture matches the word, without overacting." },
            { t:"A big sweep of both arms on every word", why:"That oversteps “the modesty of nature”, which is Hamlet’s warning against overdoing it." },
            { t:"No change at all, eyes on your notes", why:"That suits neither action nor word." },
            { t:"Speeding up to finish the sentence quickly", why:"Speed fights the meaning." }] },
        b:{ prompt:"Hamlet asks the players to speak “trippingly on the tongue” " + H(R.speech) + ". Which advice is closest for your defence?",
          options:[
            { t:"Speak lightly and clearly, letting the words flow without forcing them", ok:true, why:"That’s speaking “trippingly”." },
            { t:"Shout each word for emphasis", why:"That’s the “mouthing” Hamlet warns against." },
            { t:"Speak as fast as possible", why:"Tripping lightly isn’t racing." },
            { t:"Read slowly, word by word, from the page", why:"That’s stilted, not tripping." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"A questioner asks a long question about whether the frame narrative makes us side with Victor. Which paraphrase is best?",
          options:[
            { t:"“You’re asking whether giving Victor the frame makes us take his side, which would challenge my reading.”", ok:true, why:"It names the real challenge in one sentence." },
            { t:"“You’re asking about Victor.”", why:"Too vague." },
            { t:"“You think I’m wrong.”", why:"That names a feeling, not the question." },
            { t:"“You’re asking about the whole novel’s structure and also its themes.”", why:"Too broad." }] },
        b:{ prompt:"A questioner asks whether Gatsby’s parties are really for Daisy or for himself, given that he barely attends them. Which paraphrase is best?",
          options:[
            { t:"“You’re asking whether the parties are a message to Daisy or a performance for Gatsby himself.”", ok:true, why:"It names the real challenge in one sentence." },
            { t:"“You’re asking about the parties.”", why:"Too vague. " + M4 },
            { t:"“You don’t like my second claim.”", why:"Not a paraphrase." },
            { t:"“You’re asking about Daisy, Gatsby, Nick and Jordan.”", why:"Too broad. " + M4 }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which is the best opening 30 seconds for a defence?",
          options:[
            { t:"A vivid image from the novel, the thesis in one sentence, and a three-part roadmap", ok:true, why:"Hook, claim, map." },
            { t:"Reading the essay’s first paragraph aloud", why:M1 },
            { t:"A long biography of the author", why:"That delays the argument." },
            { t:"An apology for being nervous", why:"It costs ethos before you begin." }] },
        b:{ prompt:"Which is the best closing for a defence?",
          options:[
            { t:"A one-sentence return to the thesis framed as a resonant contrast, then an invitation to questions", ok:true, why:"Return, resonate, invite." },
            { t:"“That’s all; any questions?”", why:"There’s no return to the thesis." },
            { t:"A list of everything you didn’t have time to say", why:"That ends on what’s missing." },
            { t:"Reading your conclusion paragraph word for word", why:M1 }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Which slide best supports your claim about the green light?",
          options:[
            { t:"The quotation “Gatsby believed in the green light” in large type, with “believed” highlighted, and nothing else", ok:true, why:"One idea; you speak the analysis." },
            { t:"Your full paragraph of analysis in small type", why:M5 },
            { t:"Ten images of green lights from the internet", why:"Clutter, and possibly copyrighted images." },
            { t:"A chart of how many times “green” appears, with no labels", why:"It’s unreadable without labels." }] },
        b:{ prompt:"Which slide best supports your claim about Jane’s declaration?",
          options:[
            { t:"“I am no bird” in large type, with “no” highlighted, and nothing else", ok:true, why:"One idea; you speak the analysis." },
            { t:"Your full paragraph of analysis", why:M5 },
            { t:"A collage of bird photos", why:"It distracts from the words." },
            { t:"A bulleted list of every chapter", why:M5 }] } },
      { id:"a2", cat:"A", goal:[6, 2],
        a:{ prompt:"Your rehearsal data shows: 5:10 for a 6-minute plan, 2 pauses, eyes on notes for most of claim 2. What’s the best next practice step?",
          options:[
            { t:"Rehearse claim 2 from a cue card only, adding planned pauses at its key words", ok:true, why:"It targets the two weakest signals." },
            { t:"Add 150 words of new content", why:"The timing is fine; delivery is the issue." },
            { t:"Speak faster to finish early", why:M2 },
            { t:"Memorize claim 2 word for word", why:"Memorizing usually locks the eyes inward." }] },
        b:{ prompt:"Your rehearsal data shows: 7:05 for a 6-minute plan, 14 stresses in a 60-word passage, good eye contact. What’s the best next practice step?",
          options:[
            { t:"Cut about a minute of content and reduce the stresses to the 3–5 words that carry meaning", ok:true, why:"It fixes the timing and the over-stressing together." },
            { t:"Speak faster", why:M2 },
            { t:"Add more stresses so nothing is missed", why:"When everything is stressed, nothing is." },
            { t:"Read from the script to save time", why:M1 }] } }
    ]
  },
  task:{
    title:"Performance task: Defence plan", summary:"Defence plan",
    statement:"<p>Plan the defence you’ll give in class: timed, voiced and ready for questions. The checklist makes sure the parts are there. Your teacher will hear the rest.</p><p class='tiny muted'>Your title, thesis, segments and cue notes come from Plan mode in the rehearsal coach; your rehearsals and self-review come from Rehearse mode. Everything stays on this device. Structure checks aren’t delivery checks: the in-class defence and the rubric carry the assessment.</p>" + RUB,
    checks:["It fits the time", "Thesis stated", "Roadmap given", "Claims carry evidence", "Every kind of question anticipated", "Answers use the four moves", "A closing line that lands", "Rehearsed out loud", "Reviewed honestly", "Craft statement written"],
    tips:[
      "Fit 5–7 minutes: about 90 s per claim works for most plans.",
      "State your thesis in one sentence, naming your novel and author.",
      "Give the map: “I’ll show this in three ways: first…, second…, finally…”",
      "Each claim needs its one best quotation, cited.",
      "Write one question of each kind, especially the counterargument you fear most.",
      "Tag your moves. If one is missing, add a sentence for it.",
      "End on a line people will remember. Try a balanced contrast, like Lincoln’s.",
      "Run it aloud with the timer at least once; it’s the only way to know your real time.",
      "Rate each item honestly; then name one thing to practise.",
      "Tell your teacher what you chose and why."
    ],
    explainPrompt:"Craft statement: Which choice in your plan best fits <em>your</em> voice: a hook, a pause, an answer? Why? What will you practise between now and the real defence?",
    explainLabel:"Craft statement",
    vocab:"Use thesis, roadmap, pace, pause, acknowledge and evidence.",
    checkLabel:"Check my plan",
    success:"Your defence plan has all its parts. Your teacher will hear the rest at the in-class defence.",
    models:[
      { title:"Claim-led (<i>Frankenstein</i>, 6:00)",
        plan:"Opening (25 s): “The first thing the Creature does is reach toward his maker, and the first thing his maker does is run.” Thesis and roadmap (45 s): “first, his eloquence; second, the pattern of rejection; finally, the verdict he names.” Three claims of 90 s each, quoting “I was benevolent and good; misery made me a fiend” (Shelley, ch. 10) and “Beware; for I am fearless, and therefore powerful” (Shelley, ch. 20). Closing (25 s): “Shelley’s question isn’t what the Creature is, but what we make of him.” Invitation (15 s).",
        qs:"Clarification on “verdict”; evidence (“show a rejection scene”); counterargument (“just a murderer?”, answered with the four moves); extension (newcomers today)." },
      { title:"Question-led (<i>Jane Eyre</i>, 5:45)",
        plan:"Opening (20 s): the question “What does it cost to say no to the person you love?” Thesis and roadmap: passion as the source of Jane’s independence, “in three steps: first…”. Claims quoting “Do you think, because I am poor, obscure, plain, and little, I am soulless and heartless?” (Brontë, ch. 23) and “I am no bird; and no net ensnares me” (Brontë, ch. 23). Closing: “Jane doesn’t escape her passion; she steers by it.”",
        qs:"Counterargument answered: leaving Thornfield as passionate principle." },
      { title:"Story-led (<i>The Great Gatsby</i>, 6:20)",
        plan:"Opening (30 s): “Picture a man alone on his lawn at night, reaching toward a light across the water.” Thesis and roadmap: the dream survives by refusing evidence, “through the parties, the green light, then the final current”. Claims quoting “‘Can’t repeat the past?’ he cried incredulously. ‘Why of course you can!’” (Fitzgerald, ch. 6) and “So we beat on, boats against the current, borne back ceaselessly into the past” (Fitzgerald, ch. 9). Closing: “Fitzgerald doesn’t ask whether we should dream, but what our dreams refuse to see.”",
        qs:"Counterargument answered: Daisy’s choice (as in Spot the Error, done right)." }
    ]
  },
  cards:[
    ["Ethos", "Credibility: why listeners should trust you. “I’ve traced every scene where someone looks at the Creature.”"],
    ["Pathos", "Emotion: why listeners should care. Strong, but never a substitute for evidence."],
    ["Logos", "Reasoning from evidence: “In all four rejection scenes, the verdict comes first.”"],
    ["Kairos", "Fitting the moment and audience: a video defence needs more signposting than a room."],
    ["Roadmap", "A preview of your path: “first…, second…, finally…”"],
    ["Pace", "Speed of speech; about 130–160 words per minute keeps listeners with you."],
    ["Pause", "Planned silence before a key word or after a big claim: “We hear (pause) him first.”"],
    ["Emphasis", "Stressing the words that carry meaning; when everything is stressed, nothing is."],
    ["Paraphrase-back", "Restating a question in one sentence to check you’ve understood it."],
    ["Four question types", "Clarification (what do you mean?) · Evidence (where?) · Counterargument (isn’t it…?) · Extension (what about…?)"],
    ["Acknowledge–answer–evidence–return", "The four moves for hard questions; concede the point, never the argument."],
    ["“Suit the action to the word”", "Hamlet’s advice " + H(R.suit) + ": gestures that fit meaning, without overacting."]
  ]
};
