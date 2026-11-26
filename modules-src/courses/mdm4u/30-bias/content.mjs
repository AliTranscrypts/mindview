// MDM4U 30 Sources of Bias in Surveys. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/30-bias.md
// Core feedback sentences for the plan's misconceptions (§3), used where the plan names only the code.
const M1 = "More people from the same biased frame gives the same wrong answer with more confidence.";
const M2 = "Ask <strong>where</strong> the error enters: who is asked (sampling), who answers (non-response), how honestly (response), or how the question or tool measures (measurement).";
const M3 = "Biases can cancel by luck. Judge the design, not one lucky result.";
const M4 = "Leading wording changes honest answers: the question itself pushes people.";
const M5 = "Volunteers choose themselves; thousands of volunteers are still not a random sample.";
const M6 = "Check where the axis starts: a cut-off axis turns a 3% rise into a towering bar.";
const M7 = "Names can make people less honest on sensitive questions. Anonymity reduces response bias and protects privacy.";
const SORT_DEF = "Ask where the error enters: who’s asked, who answers, how honestly, or how it’s measured.";

export default {
  id:"30-bias",
  kind:"topic",
  title:"Sources of bias in surveys",
  topic:"Sources of Bias in Surveys",
  readyTopic:"sources of bias in surveys",
  hero:{
    headline:"Big samples can still be wrong",
    text:"A survey can go wrong before a single number is calculated. <strong>Sampling bias</strong> asks the wrong people, <strong>non-response bias</strong> hears from the wrong people, <strong>response bias</strong> gets untruthful answers, and <strong>measurement bias</strong> builds the push into the question or tool. Unlike random error, <strong>bias doesn’t shrink</strong> when you ask more people.",
    fig:{ aria:"A bar labelled true support 50% stands beside an empty estimate bar. A landline phone list slides in and the estimate bar rises only to 40%. A speech bubble with a leading question appears and the estimate rises to 55%. A times-10 sample badge pops on: the estimate bar doesn’t move, but its thin error whisker shrinks. Caption: size shrinks the whisker, not the push.", shape:"wide" }
  },
  goals:[
    "I can identify sampling, non-response, response and measurement bias in a survey.",
    "I can predict which way a bias pushes a result, and estimate its size in a simple model.",
    "I can explain why a bigger sample doesn’t remove bias, and why biases that happen to cancel don’t make a design trustworthy.",
    "I can design fair questions and procedures: neutral, single-issue wording, consent, privacy, and no cultural bias.",
    "I can evaluate statistics and graphs in the media by checking sources, samples, questions and scales."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Sampling methods", goal:1, prompt:"Asking the first 30 people who walk past you in a mall is which kind of sample?",
          options:[
            { t:"Convenience", ok:true, why:"Whoever is handy." },
            { t:"Simple random", why:"Passers-by aren’t chosen by chance from a list." },
            { t:"Stratified", why:"No groups were sampled from." },
            { t:"Systematic", why:"There’s no list and no interval." }],
          hints:["Who decided who was asked?", "Whoever walked by.", "Convenience."] },
        { id:"w2", skill:"Sampling methods", goal:4, prompt:"Which of these samples is random?",
          options:[
            { t:"Every 10th name on the full town list, after a random start", ok:true, why:"Systematic with a random start." },
            { t:"Residents who volunteer at a town hall meeting", why:"Volunteers choose themselves." },
            { t:"Shoppers at the mall on Saturday", why:"Convenience." },
            { t:"The surveyor’s neighbours", why:"Convenience." }],
          hints:["Does chance choose the people?", "Only one option uses a random start on a full list.", "Every 10th name on the town list."] },
        { id:"w3", skill:"Weighted averages", goal:2, prompt:"100 people answer ‘yes’ at a rate of 80%, and 100 others at a rate of 30%. What percent of all 200 say yes?",
          options:[
            { t:"55%", ok:true, why:"(80 + 30) ÷ 200." },
            { t:"110%", why:"Percents of different groups don’t add." },
            { t:"50%", why:"That guesses the middle of 0 and 100. Use the counts." },
            { t:"80%", why:"That uses one group. Combine both groups." }],
          hints:["How many yeses in each group?", "80 and 30.", "110 ÷ 200 = 55%."] },
        { id:"w4", skill:"Weighted averages", goal:2, prompt:"10 people at 80% yes and 90 people at 30% yes. What percent of all 100 say yes?",
          options:[
            { t:"35%", ok:true, why:"8 + 27 = 35 yeses out of 100." },
            { t:"55%", why:"That averages the two rates. The groups are different sizes." },
            { t:"50%", why:"Use the counts." },
            { t:"30%", why:"That ignores the small group. The 10 people still count." }],
          hints:["Count the yeses.", "8 from the first group, 27 from the second.", "35 out of 100."] },
        { id:"w5", skill:"Percent change", goal:5, prompt:"Sales rose from 960 to 990. What is the percent increase, to 1 decimal place?",
          options:[
            { t:"3.1%", ok:true, why:"30 ÷ 960 ≈ 0.031." },
            { t:"30%", why:"That uses the change as a percent. Divide the change by the starting value." },
            { t:"97%", why:"That divides 960 by 990. That’s a ratio, not a change." },
            { t:"1.03%", why:"That misreads the ratio 1.03. The ratio 1.03 means a 3% increase." }],
          hints:["Change ÷ original.", "30 ÷ 960.", "≈ 3.1%."] },
        { id:"w6", skill:"Percent change", goal:5, prompt:"Incidents rose from 4 to 6. What is the percent increase?",
          options:[
            { t:"50%", ok:true, why:"2 ÷ 4." },
            { t:"2%", why:"That uses the change as a percent. Divide by the original." },
            { t:"33%", why:"That divides by the new value. Divide by 4, not 6." },
            { t:"150%", why:"That uses the ratio 1.5. 1.5 times means a 50% increase." }],
          hints:["Change ÷ original.", "2 ÷ 4.", "50%."] }
      ],
      refreshers:{
        "Sampling methods":"Random methods (simple random, systematic, stratified, cluster) let chance choose. Convenience and voluntary samples let the surveyor or the respondents choose.",
        "Weighted averages":"To combine groups, count the yeses in each group, add them, and divide by the total number of people. Don’t average the percents.",
        "Percent change":"Percent change = (new − original) ÷ original × 100."
      }
    }
  },
  explore:{
    heading:"Bias switchboard",
    intro:"Flip bias switches on a town survey and watch the estimate move away from the truth. Then try changing the sample size.",
    predIntro:"Make a prediction first. Then the switchboard will show you what really happens.",
    predictions:[
      { id:"p1", start:{ sw:[], n:100, mode:"sw" }, flip:["s"],
        prompt:"Start with all switches off. Turn on sampling bias (the landline list). The estimate will…",
        options:[{ t:"fall below 50%", ok:true }, { t:"rise above 50%" }, { t:"stay at 50%" }, { t:"fall to 0%" }],
        explain:"The gauge drops to 40.0%. Young residents, the strongest supporters, are mostly missing from the landline list." },
      { id:"p2", start:{ sw:["s"], n:100, mode:"polls" },
        prompt:"Sampling bias on, <i>n</i> = 100. The sample size goes from 100 to 400. The estimate will…",
        options:[{ t:"stay at about 40%, with a narrower margin", ok:true }, { t:"move back to 50%" }, { t:"drop further" }, { t:"become exactly right" }],
        explain:"In Repeated polls mode the cloud tightens around 40%, not 50%. Size shrinks random error only. " + M1 },
      { id:"p3", start:{ sw:[], n:100, mode:"sw" }, flip:["m"],
        prompt:"All switches off. Turn on measurement bias (the leading question). The estimate will…",
        options:[{ t:"rise to about 65%", ok:true }, { t:"stay at 50%, because people are honest" }, { t:"fall" }, { t:"rise to 100%" }],
        explain:"65.0%. The wording pushes honest people toward yes." },
      { id:"p4", start:{ sw:["s", "nr", "m"], n:100, mode:"sw" },
        prompt:"Turn on sampling, non-response and measurement bias together; the estimate is 51.9%. What should you conclude?",
        options:[{ t:"The design is still biased; the errors happen to cancel here", ok:true }, { t:"The survey is trustworthy because it’s close to 50%" }, { t:"Three biases always cancel" }, { t:"The true support must be 51.9%" }],
        explain:"Each switch was toggled off in turn: without the leading question the estimate falls to 36.9%, and it climbs back to 51.9% only because the push up offsets the push down. Close by luck. With a different town the same design could miss by a lot." }
    ],
    chalIntro:"Use the switchboard to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Get an estimate within 1 percentage point of the truth, using a design you could defend.",
        why:"With every switch off, the sample is random from a full frame, everyone is followed up and the question is neutral: 50.0%, right by design, not by luck.",
        general:"Which settings cause bias?",
        hints:["Which settings cause bias?", "All four switches do.", "Turn them all off."] },
      { id:"tc2", goal:2, prompt:"With exactly two switches on, make the estimate as low as possible.",
        why:"Sampling and non-response bias both lose young supporters, so together they pull the estimate down to 36.9%.",
        hints:["Which switches push the estimate down?", "Sampling and non-response both lose young supporters.", "Turn on those two: 36.9%."] },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"Before flipping any switches, predict the estimate with <strong>sampling bias and measurement bias</strong> both on. Enter your prediction, then check. (Press <strong>Start challenge 3</strong> under the switches.)",
        why:"The frame reaches 10 youth, 100 adults and 90 seniors; with the leading question their yes rates are 95%, 60% and 45%: (9.5 + 60 + 40.5) ÷ 200 = 110 ÷ 200 = 55%.",
        hints:["The frame reaches 10 youth, 100 adults and 90 seniors.", "With the leading question their yes rates are 95%, 60% and 45%.", "(9.5 + 60 + 40.5) ÷ 200 = 110 ÷ 200 = 55%."] }
    ]
  },
  part3:{
    slug:"media", name:"Media watch",
    heading:"Media watch",
    intro:"Five made-up news items, each with a problem in how its numbers were collected or shown. Tag the problems, choose the fixes, and use <strong>Check it with data</strong> to recalculate or redraw the numbers.",
    stations:[
      { id:"m1", title:"The big online poll",
        news:"“92% of readers want the highway speed limit raised: 18 000 votes!”",
        src:"An online poll on a driving-enthusiast website.",
        steps:[
          { id:"m1a", goal:5, kind:"multi", prompt:"Tag the problems. Choose every one that applies, then press Check.",
            options:[
              { t:"Voluntary response: readers chose whether to vote", ok:true },
              { t:"The frame is driving enthusiasts, not all Canadians", ok:true },
              { t:"18 000 votes is too small a sample", why:"18 000 is plenty of votes. " + M5 },
              { t:"The 92% must be calculated wrong", why:"The arithmetic may be fine; who voted is the problem." }],
            why:"Both problems are about who was counted: people who chose to vote, on a site for driving enthusiasts." },
          { id:"m1b", goal:5, kind:"one", prompt:"Which conclusion is justified?",
            options:[
              { t:"The 92% describes people who chose to vote on a driving site, not Canadians.", ok:true, why:M5 },
              { t:"About 92% of Canadians agree, give or take 1%.", why:"A margin of error applies only to random samples. " + M5 },
              { t:"About 92% of Canadian drivers agree.", why:"Only drivers who visit this site and chose to vote were counted." },
              { t:"The poll tells us nothing about anyone.", why:"It describes the people who voted; it just can’t be generalized." }] }],
        after:"Thousands of volunteers are still volunteers. A bigger pile of votes from the same site can’t fix who chose to vote." },
      { id:"m2", title:"The cliff-edge graph",
        news:"“Sales soar!”",
        src:"A store’s bar graph of monthly sales: 960 in May, 990 in June.",
        graph:true,
        steps:[
          { id:"m2a", goal:5, kind:"one", prompt:"Look at the graph. By what percent did sales really grow?",
            options:[
              { t:"About 3.1%", ok:true, why:"30 ÷ 960 ≈ 0.031." },
              { t:"About 300%", why:"That’s how the bars look: 40 above 950 against 10 above 950. " + M6 },
              { t:"About 30%", why:"30 is the change in sales, not a percent. Divide it by 960." },
              { t:"About 97%", why:"960 ÷ 990 is a ratio, not a change." }] }],
        after:"The vertical axis starts at 950, so June’s bar looks four times as tall as May’s. Drawn from 0, the two bars are almost the same height." },
      { id:"m3", title:"The missing details",
        news:"“4 out of 5 experts recommend Brand Z.”",
        src:"A made-up ad for a made-up product.",
        steps:[
          { id:"m3a", goal:5, kind:"multi", prompt:"Which missing facts matter most before you believe it? Choose every one that matters, then press Check.",
            options:[
              { t:"How many experts were asked", ok:true },
              { t:"How the experts were chosen", ok:true },
              { t:"Who paid for the survey", ok:true },
              { t:"The exact question they were asked", ok:true },
              { t:"The colour of the packaging", why:"The packaging tells you nothing about the survey." }],
            why:"4 of 5 could mean 4 of 5 people the company picked. Who was asked, how many, who paid and the exact question decide what the number means." }],
        after:"Who was asked decides what the number means." },
      { id:"m4", title:"The survey that asks too much",
        news:"A class survey to “study study habits” asks for each student’s name, home address, family income, health conditions and hours of homework each week.",
        src:"A made-up class survey.",
        steps:[
          { id:"m4a", goal:4, kind:"multi", prompt:"Flag every question that raises a privacy or ethics problem for this study, then press Check.",
            options:[
              { t:"Name", ok:true },
              { t:"Home address", ok:true },
              { t:"Family income", ok:true },
              { t:"Health conditions", ok:true },
              { t:"Hours of homework each week", why:"That’s the one question the study needs." }],
            why:"None of the personal questions is needed to study study habits, and each one could identify students or expose private information." },
          { id:"m4b", goal:4, kind:"one", prompt:"Choose the fix.",
            options:[
              { t:"Make it anonymous, ask for informed consent, and ask only the questions the study needs", ok:true, why:"Anonymous, consent, only the necessary questions." },
              { t:"Keep the names so answers can be checked for honesty", why:M7 },
              { t:"Ask the same questions face to face", why:"Face to face is even less private, so answers may be less honest." },
              { t:"Promise to delete the answers after a year", why:"It still collects far more than the study needs, without consent." }] }],
        after:"An ethical survey asks for consent, keeps answers anonymous or confidential, and collects only what it needs." },
      { id:"m5", title:"The culturally narrow question",
        news:"“What gifts does your family exchange at Christmas?”",
        src:"A question in a made-up survey about holiday spending.",
        steps:[
          { id:"m5a", goal:4, kind:"one", prompt:"Choose the best fix.",
            options:[
              { t:"“Does your family exchange gifts at any celebration during the year? If so, about how much is spent?”", ok:true, why:"It works for every family, whatever they celebrate." },
              { t:"Ask only families who celebrate Christmas.", why:"That builds sampling bias into the survey: the results would describe only some families." },
              { t:"“What gifts does your family exchange at Christmas or Hanukkah?”", why:"Still assumes particular traditions; many families celebrate other occasions." },
              { t:"Keep the question: most families can answer it.", why:"It assumes one culture’s customs. That’s cultural bias, and it leaves families out." }] }],
        after:"A question with cultural bias assumes one culture’s customs. Ask about any celebration instead." }
    ],
    quickCheck:{
      title:"Media watch quick check", summary:"Media watch quick check",
      items:[
        { id:"q1", goal:5, prompt:"Sales rose from 960 to 990. The true percent increase is about…",
          choices:[
            { t:"3%", ok:true, fb:"Right. 30 ÷ 960 ≈ 3.1%." },
            { t:"30%", fb:"30 ÷ 960 ≈ 3.1%." },
            { t:"300%", fb:"30 ÷ 960 ≈ 3.1%. " + M6 },
            { t:"99%", fb:"30 ÷ 960 ≈ 3.1%." }] },
        { id:"q2", goal:5, prompt:"An online poll gets 18 000 votes. Is it representative?",
          choices:[
            { t:"No: voluntary response", ok:true, fb:"Right. " + M5 },
            { t:"Yes: it’s huge", fb:"Size can’t fix self-selection." },
            { t:"Yes, if the margin is small", fb:"Size can’t fix self-selection." },
            { t:"No: too small", fb:"Size can’t fix self-selection." }] },
        { id:"q3", goal:5, prompt:"Which fact matters most when judging ‘4 out of 5 experts agree’?",
          choices:[
            { t:"How the experts were chosen and how many there were", ok:true, fb:"Right. Who was asked decides what the number means." },
            { t:"The font of the ad", fb:"Who was asked decides what the number means." },
            { t:"The day it aired", fb:"Who was asked decides what the number means." },
            { t:"The product’s price", fb:"Who was asked decides what the number means." }] },
        { id:"q4", goal:4, prompt:"Why make a sensitive survey anonymous?",
          choices:[
            { t:"People answer more honestly and their privacy is protected", ok:true, fb:"Right. Anonymity reduces response bias; it doesn’t change who is sampled." },
            { t:"It makes it shorter", fb:"Anonymity reduces response bias; it doesn’t change who is sampled." },
            { t:"It makes the sample random", fb:"Anonymity reduces response bias; it doesn’t change who is sampled." },
            { t:"It removes sampling bias", fb:"Anonymity reduces response bias; it doesn’t change who is sampled." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"name", type:"sorter", title:"Name the bias", summary:"Name the bias", goal:1, noun:"situation", txt:true,
        instruction:"Sort each situation into the bias it shows.",
        boxes:[{ id:"samp", label:"Sampling bias", sub:"who is asked" }, { id:"nonr", label:"Non-response bias", sub:"who answers" }, { id:"resp", label:"Response bias", sub:"how honestly" }, { id:"meas", label:"Measurement bias", sub:"how it’s measured" }],
        wrongDefault:SORT_DEF,
        items:[
          { id:"i1", t:"A survey about public transit is mailed only to car owners.", answer:"samp", why:"The frame leaves out people who rely on transit." },
          { id:"i2", t:"Only 15% of a mailed survey comes back, mostly from retirees.", answer:"nonr", why:"The people who sent it back differ from those who didn’t.",
            wrong:{ samp:"These people were chosen; the problem is who sent it back. " + M2 } },
          { id:"i3", t:"“Don’t you agree that the overpriced cafeteria food should be cheaper?”", answer:"meas", why:"Leading, loaded wording builds the push into the question.",
            wrong:{ resp:"The <strong>question</strong> builds in the push, so it’s measurement bias. Response bias is about people choosing to answer untruthfully. " + M2 } },
          { id:"i4", t:"A bathroom scale used in a fitness study reads 2 kg too heavy.", answer:"meas", why:"A faulty instrument measures wrongly." },
          { id:"i5", t:"Students are asked in front of their teacher whether they’ve ever cheated.", answer:"resp", why:"Pressure leads to untruthful answers." },
          { id:"i6", t:"A survey about internet habits is done only by landline phone.", answer:"samp", why:"The frame leaves out people without a landline." },
          { id:"i7", t:"A rating scale offers only “Excellent, Very good, Good, Fair”.", answer:"meas", why:"A lopsided scale pushes ratings up.",
            wrong:{ resp:"The scale itself leans positive." } },
          { id:"i8", t:"People overstate how often they recycle, to look responsible.", answer:"resp", why:"Wanting to look good leads to untruthful answers." },
          { id:"i9", t:"Busy parents rarely answer an evening phone survey about child care.", answer:"nonr", why:"The parents were in the sample, but many didn’t answer.",
            hints:["Were the parents included in the sample?", "Yes, but many didn’t answer.", "Non-response."] },
          { id:"i10", t:"A city-wide opinion survey is done in one wealthy neighbourhood.", answer:"samp", why:"The method over-represents one group." }
        ] },
      { id:"fix", type:"mc", title:"Fix the survey", summary:"Fix the survey", goal:[4, 5], star:true,
        instruction:"Choose the best fix for each survey problem. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Choose an answer, then press Check.",
        items:[
          { id:"f1", goal:4, prompt:"“Wouldn’t a beautiful new park make our town better?”",
            options:[
              { t:"“Do you support or oppose building a new park?”", ok:true, why:"Neutral wording that names both sides." },
              { t:"“Should the town build a lovely new park?”", why:"‘Should the town build a lovely new park?’: still leading." },
              { t:"“Wouldn’t a new park make our town better?”", why:"‘Wouldn’t … better?’ still suggests yes. " + M4 },
              { t:"Ask more people the same question", why:"More people doesn’t fix the wording. " + M4 }] },
          { id:"f2", goal:4, prompt:"“Should the town lower taxes and build a new arena?”",
            options:[
              { t:"Split it into two questions", ok:true, why:"Each question now asks about one thing." },
              { t:"Keep it, with answers Yes / No", why:"Answering yes or no to both at once hides what people think of each." },
              { t:"Add the answer ‘Unsure’", why:"Still two questions in one: an answer can’t show which part people mean." },
              { t:"Ask only property owners", why:"That adds sampling bias and still asks two things at once." }] },
          { id:"f3", goal:4, prompt:"<span class=\"tag\">★</span> A survey about youth programs samples from the landline list.",
            options:[
              { t:"Sample at random from the town’s full resident list", ok:true, why:"A full frame and random selection reach young residents too." },
              { t:"Take a bigger sample from the landline list", why:"A bigger landline sample: the same frame, the same bias. " + M1 },
              { t:"Call only in the evening, when people are home", why:"Still the landline frame: young residents are still missing." },
              { t:"Ask the questions face to face instead of by phone", why:"That changes how people are asked, not who is in the frame." }] },
          { id:"f4", goal:4, prompt:"<span class=\"tag\">★</span> 20% of mailed surveys are returned.",
            options:[
              { t:"Send reminders, follow up by phone, and keep it short and anonymous", ok:true, why:"Follow-ups bring back the people who didn’t answer the first time." },
              { t:"Count only the returns", why:"Count only the returns: that keeps the non-response bias." },
              { t:"Mail it to twice as many people", why:"Twice as many returns from the same kind of people. " + M1 },
              { t:"Add more questions so it covers everything", why:"Long surveys raise non-response." }] },
          { id:"f5", goal:[4, 5], prompt:"<span class=\"tag\">★</span> “What does your family cook for Christmas dinner?” (a survey on holiday food spending)",
            options:[
              { t:"“Does your household share a special meal for any celebration? About how much is spent?”", ok:true, why:"It works for every household, whatever they celebrate." },
              { t:"Ask only families who celebrate Christmas", why:"Ask only families who celebrate Christmas: that builds sampling bias into the survey." },
              { t:"“What does your family cook for Christmas or Thanksgiving dinner?”", why:"Still assumes particular holidays; many families celebrate others." },
              { t:"Make the survey anonymous", why:"Anonymity protects privacy, but the question still assumes one culture’s customs." }] },
          { id:"f6", goal:4, prompt:"<span class=\"tag\">★</span> A wellness survey asks for names, addresses and health conditions.",
            options:[
              { t:"Make it anonymous, get informed consent, and ask only what the study needs", ok:true, why:"Anonymous, consent, only the necessary questions." },
              { t:"Keep the names to check honesty", why:"Keep the names to check honesty: names make sensitive answers less honest, and they risk privacy. " + M7 },
              { t:"Survey more people so the answers average out", why:"More people doesn’t fix a privacy or honesty problem." },
              { t:"Ask the questions aloud in a group", why:"Public answers are even less private and less honest." }],
            hints:["What could happen to this information?", "It could identify people; would they answer honestly?", "Anonymous, consent, only the necessary questions."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Tavish", goal:[1, 3],
        instruction:"Tavish made one mistake in each piece of reasoning. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"A gaming website’s poll got 25 000 votes: 70% say teens should get more screen time. Is the result reliable?",
            steps:["The population of interest is Canadian teens.", "The respondents are visitors to a gaming site who chose to vote.", "With 25 000 votes the margin of error is tiny, so the 70% is reliable.", "So most Canadian teens want more screen time."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 describes the sample accurately.", "", "This follows the earlier slip."],
            fixes:[
              { t:"The margin of error only describes random samples. This is a voluntary sample of gamers, which is biased however many vote.", ok:true, why:"Bias isn’t fixed by size." },
              { t:"25 000 is too few.", why:M1 },
              { t:"The margin is large, so the result is unreliable.", why:"The margin isn’t the issue; the sample is." },
              { t:"Step 3 is correct.", why:M1 + " " + M5 }],
            hints:["Was the sample random?", "No: gamers chose to vote.", "Bias isn’t fixed by size."] },
          { id:"e2", goal:1, task:"A survey asks ‘Don’t you think the unsafe old playground should be replaced?’ Classify the bias and fix it.",
            steps:["The wording suggests the answer ‘yes’.", "That makes it sampling bias.", "Fix: survey more people."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "This follows the misclassification."],
            fixes:[
              { t:"It’s measurement bias: the question itself pushes answers. Fix the wording: ‘Should the playground be replaced, repaired or left as it is?’", ok:true, why:"What was asked is the problem, so reword it." },
              { t:"It’s non-response bias; send reminders.", why:"Nobody failed to answer; the wording is the problem. " + M2 },
              { t:"It’s response bias; make it anonymous.", why:"People aren’t lying; the wording pushes them." },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["Is the problem who was asked, or what was asked?", "What was asked.", "Measurement bias: reword it."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the switchboard: that a bigger sample didn’t help, or that three biases nearly cancelled?" },
      { id:"j2", q:"In your own words, explain the difference between bias and random sampling error." },
      { id:"j3", q:"Explain to a friend how to turn a leading question into a neutral one, with an example from your own life." },
      { id:"j4", q:"Find (or imagine) a statistic from an ad or a headline. What would you ask before believing it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A survey about a new bike lane is given only to customers at a car dealership. What type of bias is this?", options:[
          { t:"Sampling bias", ok:true, why:"The sample leaves out cyclists and many others." },
          { t:"Non-response bias", why:"Nobody failed to respond." },
          { t:"Response bias", why:"Nothing suggests untruthful answers." },
          { t:"Measurement bias", why:"The question isn’t the problem; the people asked are." }] },
        b:{ prompt:"Only 10% of a mailed survey comes back, mostly from people angry about the issue. What type of bias is this?", options:[
          { t:"Non-response bias", ok:true, why:"The people who sent it back differ from those who didn’t." },
          { t:"Sampling bias", why:"The mailing list may be fine; who answered is the problem." },
          { t:"Measurement bias", why:M2 },
          { t:"Response bias", why:"The answers may be honest; the missing voices are the issue." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"‘Don’t you agree that the unfair new parking fees should be removed?’ This question introduces…", options:[
          { t:"measurement bias (leading, loaded wording)", ok:true, why:"‘Don’t you agree’ leads, and ‘unfair’ loads the question." },
          { t:"sampling bias", why:M2 },
          { t:"non-response bias", why:M2 },
          { t:"no bias, if people answer honestly", why:M4 }] },
        b:{ prompt:"Students asked in front of their coach whether they skipped practice mostly say no. This is…", options:[
          { t:"response bias", ok:true, why:"Pressure leads to untruthful answers." },
          { t:"measurement bias", why:"The question itself is neutral." },
          { t:"sampling bias", why:M2 },
          { t:"non-response bias", why:M2 }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which feature makes a survey ethical?", options:[
          { t:"Participants give informed consent and their answers are kept confidential", ok:true, why:"Consent and privacy are the heart of an ethical survey." },
          { t:"Participants must give their full names", why:M7 },
          { t:"The survey is as long as possible", why:"Long surveys raise non-response." },
          { t:"Only people who agree with the sponsor are asked", why:"That’s sampling bias, and it isn’t ethical." }] },
        b:{ prompt:"Which question shows cultural bias?", options:[
          { t:"“What gifts did your family exchange at Christmas?”", ok:true, why:"It assumes one tradition." },
          { t:"“How many hours of sleep did you get last night?”", why:"Everyone can answer this, whatever their culture." },
          { t:"“How do you usually travel to school?”", why:"Everyone can answer this, whatever their culture." },
          { t:"“Do you have a library card?”", why:"Everyone can answer this, whatever their culture." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Model town: youth 100 (80% support), adults 200 (45%), seniors 100 (30%). A landline frame reaches 10% of youth, 50% of adults and 90% of seniors. What is the expected estimate?", options:[
          { t:"40%", ok:true, why:"(8 + 45 + 27) ÷ 200." },
          { t:"50%", why:"That ignores the frame." },
          { t:"51.7%", why:"That averages the three rates without weighting." },
          { t:"36.9%", why:"That adds non-response too." }] },
        b:{ prompt:"Same town, full frame, but response rates of 20% (youth), 50% (adults) and 80% (seniors). What is the expected estimate?", options:[
          { t:"42.5%", ok:true, why:"(16 + 45 + 24) ÷ 200." },
          { t:"50%", why:"That ignores who responds." },
          { t:"51.7%", why:"Weight by the number of responders." },
          { t:"36.9%", why:"That adds the landline frame." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A poll’s sample grows from 500 to 5000 people, drawn from the same biased frame. What happens?", options:[
          { t:"The random margin of error shrinks, but the bias stays the same", ok:true, why:"Size shrinks random error only." },
          { t:"The bias disappears", why:M1 },
          { t:"Both the bias and the margin shrink", why:"Only the margin shrinks. " + M1 },
          { t:"Both grow", why:"Bigger samples don’t add bias." }] },
        b:{ prompt:"Two biases push a survey’s result in opposite directions, and it lands near the true value. What is the best conclusion?", options:[
          { t:"The design is still biased; the result was close by luck and could be far off elsewhere", ok:true, why:M3 },
          { t:"The survey is unbiased", why:M3 },
          { t:"Biases always cancel", why:M3 },
          { t:"The true value must be different from what was thought", why:"The truth doesn’t change." }] } },
      { id:"t3", cat:"T", goal:[3, 4],
        a:{ prompt:"A council surveys residents about a youth skate park using the landline list and the question ‘Don’t you agree teens need a safe place to skate?’ Which two changes would most reduce bias?", options:[
          { t:"Sample at random from the full resident list, and use neutral wording", ok:true, why:"That fixes both the frame and the wording." },
          { t:"Double the sample size and keep the wording", why:M1 },
          { t:"Keep the landline list and add a second question", why:"The frame and the wording stay biased." },
          { t:"Ask only youth and seniors", why:"That creates a new sampling bias." }] },
        b:{ prompt:"A hockey website polls visitors: ‘Isn’t hockey Canada’s greatest sport?’ Which two changes would most reduce bias?", options:[
          { t:"Draw a random sample from a general population list, and ask a neutral question", ok:true, why:"That fixes both who is asked and what is asked." },
          { t:"Get more votes on the website", why:M5 + " " + M1 },
          { t:"Keep the website poll but make it anonymous", why:"Anonymity doesn’t fix who chooses to vote or the wording." },
          { t:"Ask the same question to hockey coaches", why:"Another biased frame." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best rewrite of ‘Don’t you agree that the library’s hours are too short?’", options:[
          { t:"“Are the library’s current hours too short, about right, or too long?”", ok:true, why:"Neutral, with answers on every side." },
          { t:"“The library’s hours are too short, right?”", why:"Still leading. " + M4 },
          { t:"“Do you agree the library’s poor hours should be extended?”", why:"Loaded: ‘poor’." },
          { t:"“Should the library stay open longer and buy more books?”", why:"Two questions in one." }] },
        b:{ prompt:"Which is the best rewrite of ‘How much do you love our new menu?’", options:[
          { t:"“How would you rate the new menu: very poor, poor, fair, good or very good?”", ok:true, why:"A balanced scale with negative and positive answers." },
          { t:"“How great is the new menu?”", why:"Still leading." },
          { t:"“Do you love or really like the new menu?”", why:"Both choices are positive. " + M4 },
          { t:"“Rate the menu: excellent, very good or good.”", why:"No negative options." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"A headline says ‘9 in 10 readers support the ban!’ based on an online poll on the newspaper’s website. Which is the best critique?", options:[
          { t:"“Readers chose whether to respond, and one site’s readers aren’t the whole population, so the 90% can’t be generalized.”", ok:true, why:M5 },
          { t:"“9 in 10 is too high to be true.”", why:"High results can be real; the method is the issue." },
          { t:"“The poll needed a margin of error of ±1%.”", why:"No margin applies to a voluntary poll." },
          { t:"“Online polls are accurate when they’re large.”", why:M1 }] },
        b:{ prompt:"A bar graph’s vertical axis starts at 950, so sales of 990 look four times as large as sales of 960. Which is the best critique?", options:[
          { t:"“The axis doesn’t start at 0, so the bars exaggerate what is really about a 3% increase.”", ok:true, why:M6 },
          { t:"“The graph should be a pie chart.”", why:"The chart type isn’t the problem." },
          { t:"“Sales really did quadruple.”", why:"990 is only 30 more than 960." },
          { t:"“The numbers must be wrong.”", why:"The numbers are fine; the drawing distorts them." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A school wants to know how many students skip breakfast. Which plan reduces response bias the most?", options:[
          { t:"An anonymous form completed by a random sample of students during class", ok:true, why:"Anonymous answers are more honest, and the sample is random." },
          { t:"Teachers ask students aloud in class", why:"Public answers invite untruthful ones. " + M7 },
          { t:"Ask students in the cafeteria line at lunch", why:"A convenience sample: sampling bias." },
          { t:"Ask parents at a school event", why:"Parents may not know, and few attend." }] },
        b:{ prompt:"A school wants to know how many students have tried vaping. Which plan reduces response bias the most?", options:[
          { t:"An anonymous survey of a random sample, with results reported only as totals", ok:true, why:"No one can be identified, so answers are more honest." },
          { t:"Interviews in the principal’s office", why:"Fear leads to untruthful answers. " + M7 },
          { t:"Ask students to raise their hands", why:"No privacy." },
          { t:"Ask the student council", why:"A convenience sample, and not anonymous." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A news story says ‘Crime up 50%!’ Incidents in a small town rose from 4 to 6. What is the most important missing context?", options:[
          { t:"The counts are tiny: a change of 2 incidents looks like a big percent. The rate per resident and the long-term trend matter more", ok:true, why:"A 50% rise of tiny counts can be chance." },
          { t:"The story should have used a pie chart", why:"The chart isn’t the problem." },
          { t:"The 50% is calculated wrong", why:"(6 − 4) ÷ 4 = 50% is correct." },
          { t:"It’s really a 2% increase", why:"2 is the change in incidents, not a percent." }] },
        b:{ prompt:"An ad says ‘Sales tripled!’ Sales went from 2 units to 6 units. What is the most important missing context?", options:[
          { t:"With such small numbers, ‘tripled’ is only 4 more sales, so the claim sounds bigger than it is", ok:true, why:"Tiny counts make big-sounding ratios." },
          { t:"Tripled is calculated wrong", why:"6 is 3 times 2." },
          { t:"Sales went up 300%", why:"Tripling is a 200% increase, and either way the counts are tiny." },
          { t:"The ad should give the sales in dollars", why:"Possibly useful, but the tiny counts are the key issue." }] } }
    ]
  },
  task:{
    title:"Fair survey", summary:"Fair survey",
    statement:"<p>Design the town’s skate park survey so that it avoids every source of bias you’ve studied. Can you find all the answers? <span class=\"mdm-model\">model data</span></p>" +
      '<ol class="bs-conds"><li>The frame covers the whole population.</li><li>People are chosen at random.</li><li>Non-response is reduced.</li><li>The question is neutral and asks about one thing.</li><li>Respondents’ privacy is protected.</li></ol>' +
      '<p class="tiny muted">The gauge shows your design’s expected estimate in the module’s model town (true support 50%).</p>',
    checks:["Covers everyone", "Random selection", "Non-response reduced", "Neutral, single-issue question", "Privacy protected"],
    tips:["Landline, shop and online frames leave people out or let them choose themselves.", "‘Whoever answers first’ is convenience.", "Without follow-ups, busy residents drop out.", "L leads, Lo is loaded, and D asks two things at once.", "Publishing names discourages honest answers."],
    explainPrompt:"For each choice you made, name the bias it prevents and explain how.",
    vocab:"Use the words sampling bias, non-response bias, response bias and measurement bias.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Every one of these gives an expected estimate of 50.0%, matching the truth by design, not by luck.",
    afterAt:4
  },
  cards:[
    ["Bias", "A systematic error that pushes results one way."],
    ["Sampling bias", "The frame or method leaves out or over-represents groups."],
    ["Non-response bias", "People who don’t respond differ from those who do."],
    ["Response bias", "People answer untruthfully (pressure, embarrassment, wanting to please)."],
    ["Measurement bias", "The question or tool itself pushes the answers: leading or loaded wording, a faulty scale."],
    ["Leading question", "Wording that suggests the “right” answer: “Don’t you agree…?”"],
    ["Double-barrelled question", "Two questions in one: split it."],
    ["Bias vs sample size", "A bigger sample shrinks random error, not bias."],
    ["Cancelling biases", "Close by luck isn’t the same as a good design."],
    ["Ethics", "Informed consent, privacy (anonymous or confidential), only the necessary questions."],
    ["Cultural bias", "A question that assumes one culture’s customs."],
    ["Media checklist", "Who was asked? How chosen? Exact question? Who paid? Does the axis start at 0?"]
  ]
};
