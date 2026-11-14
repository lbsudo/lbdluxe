/**
 * Long-form editorial content for THE FOUNDATION 30 — DAY RECOMP.
 *
 * PDF-only. Nothing in this module is shipped to the browser; the landing page
 * imports ./program.ts instead. Keeping the two apart means the marketing page
 * stays small while the document can carry real depth.
 *
 * This is general fitness education, not medical advice. The disclaimer below
 * is part of the document and must stay in it.
 */

export const disclaimer = {
  short:
    "The Foundation 30 is general fitness education, not medical advice. Talk to a doctor before starting any new training program, especially if you have an injury, are pregnant or postpartum, or have a medical condition that affects exercise.",
  body: [
    "This program is general fitness education. It is not medical advice and it is not a substitute for an individual assessment by a qualified professional.",
    "Before starting, speak with a doctor if you have any existing injury, are pregnant or postpartum, have a history of joint or back problems, or manage any condition that affects how you exercise. If you are new to training, a short assessment with a coach is worth the time.",
    "Pain is not the goal. Stop a set if you feel sharp joint pain, numbness, or anything that feels wrong, and come back to the regression listed for that movement. Muscle fatigue is expected; sharp pain is not.",
  ],
}

export const safety = {
  title: "Training Safely",
  principles: [
    {
      heading: "Warm up every time",
      body: "Seven minutes, every session, no exceptions. The warm-up is not a formality — it is what lets the first working set be worth doing. It gets easier to skip as you get tired, which is exactly when you should not skip it.",
    },
    {
      heading: "Form decides the weight",
      body: "Stop each set when the reps stop looking like the reps you practiced. A set of eight clean push-ups beats twelve ugly ones every single time, because the ugly ones teach bad positions. When a prescribed set is beyond you, use the regression — the ladder is built so that every exercise has a real way in.",
    },
    {
      heading: "Spread the load",
      body: "Three sessions a week with two rest days between them is enough to build strength without wrecking your joints. Tendons and ligaments adapt more slowly than muscle, and they are the tissue that ends careers. The rest days are doing real work.",
    },
    {
      heading: "Tissue gets strong slowly",
      body: "Eccentrics — the lowering phase — are where tendons and ligaments do most of their rebuilding. Every press, squat and row in this program includes a controlled descent. Slow it down. That is where the durability comes from.",
    },
    {
      heading: "If something hurts",
      body: "Sharp joint pain, pain that lingers for more than a day, and numbness are all stop signals. Stop the set, note the movement and the rep, and either drop to the regression or skip that pattern for the session. Training around a problem beats training through it.",
    },
    {
      heading: "Do not rush the plan",
      body: "Thirty days is long enough to change how you move and how you feel about training. It is not long enough to change how you look, and this program does not promise that it will. What it does is build the base that everything else is built on.",
    },
  ],
}

export const nutrition = {
  title: "Eating for Recomposition",
  intro:
    "Recomposition means changing what your body is made of — more muscle, less fat — at the same time. It is the most realistic outcome for a beginner, because you are far enough from your limit that you can build muscle and lose fat on the same plan. You do not need to bulk and cut. You need to train, eat enough protein, and be patient.",
  sections: [
    {
      heading: "Protein is the anchor",
      body: "Aim for roughly 1.6 to 2.2 grams of protein per kilogram of bodyweight per day. If you weigh 80 kg, that is 130 to 175 grams a day. Spread it across three or four meals rather than one big serving — muscles use protein throughout the day, not just right after training. This is the single most important number in the document.",
    },
    {
      heading: "Calories: start at maintenance, then drift",
      body: "Weeks 1 and 2, eat roughly what you eat now. Do not cut yet. Your body is going to be busy adapting to training and you want that adaptation to be about learning the movements, not about weight loss. From Week 3, if your weight has not moved for two weeks and you want to change something, trim about 300 to 400 calories a day — mostly from liquid calories and portions, not from protein. That is a small enough change that you will keep your strength.",
    },
    {
      heading: "Carbs are not the enemy",
      body: "Carbohydrate is the fuel you train on. Keep it around training — a meal with rice, bread, potatoes or pasta two to three hours before a session, and something with carbohydrate within an hour after. Cutting carbs hard while trying to add reps is how people end up flat and stalled.",
    },
    {
      heading: "Fats and the rest",
      body: "Keep fats in the normal range — roughly a quarter of your calories. The rest of your plate is protein, carbohydrate and vegetables. If a food is a processed snack, it still counts, but the meal around it matters more than any single ingredient.",
    },
    {
      heading: "Hydration and salt",
      body: "Drink water across the day, and more on training days. A reasonable target is pale-yellow urine. Salt matters more than people think: it is what lets your muscles hold water and it drives thirst. If you are training hard and cramping, add a little salt rather than cutting it.",
    },
    {
      heading: "Supplements, honestly",
      body: "Three have real evidence behind them and all three are optional. Creatine monohydrate, 3 to 5 grams daily, improves strength and lean mass. A quality protein powder is just a convenient way to hit your protein target. Vitamin D if you are deficient, which a surprising number of people are. Everything else is marketing. Supplements cannot replace training, protein or sleep.",
    },
  ],
}

export const recovery = {
  title: "Sleep and Recovery",
  body: [
    "Seven to nine hours of sleep. This is not a wellness platitude — growth hormone and testosterone output, muscle protein synthesis and appetite regulation all key off sleep, and short sleep makes the three hardest things about this program harder: showing up, recovering between sessions, and holding discipline in the kitchen.",
    "Eat within about two hours of training if you can, with protein and carbohydrate. It is not a magic window, but it is convenient and it works.",
    "Muscle soreness is not a measure of a good session. It is a measure of an unfamiliar stimulus. By Week 3 you should feel markedly less sore, and if you do not, your sessions are probably too far apart or too easy.",
    "If you miss a session, do not try to make it up. Skip it, resume on the next scheduled day, and let the program run to Day 30 as written. Missing one session costs you almost nothing. Missing two in a row is how programs end.",
    "If you are sore enough that training hurts, take a rest day in the middle of the week. The plan is not a contract. It is a direction.",
  ],
}

export const tracking = {
  title: "The Tracking System",
  intro:
    "Without numbers you cannot tell whether the program is working, and you will end up changing things at random. Thirty days is short enough that you need a simple record, and long enough that the data will already be telling you something.",
  whatToTrack: [
    "Bodyweight — same time of day, ideally first thing in the morning, and only if you are comfortable with it. Look at the weekly average, not the daily number. Daily weight swings of 1 to 2 kg are normal and meaningless.",
    "Waist measurement — once a week, at the navel, tape snug but not tight, at the end of a normal exhale. This is the measurement that matters most for recomposition. If the waist is going down and the weight is roughly flat, that is the program working exactly as intended.",
    "The log sheet in this document — every set, every session. Write the reps you actually did, not the ones you planned.",
    "How the session felt — one word. Good, okay, or heavy. Three weeks of the same sessions is a training history. Write it down and you will start to see your own pattern.",
  ],
  weeklyReview: [
    "End of Week 1 — can you do every movement with clean form? If not, you are still in Week 1 movements. That is fine. Repeat the week.",
    "End of Week 2 — is the average waist measurement down, flat, or up? Up by more than a centimetre or two across the week means you are eating more than you think. Fix the food, not the training.",
    "End of Week 3 — have your numbers moved? Strength up and waist flat is a good result. Strength up and waist down is a great one.",
    "Day 29 — run the benchmark and record it. These numbers are your baseline for whatever you do next.",
  ],
}

export const faq = {
  title: "Questions People Ask",
  items: [
    {
      q: "I am completely untrained. Is this too much?",
      a: "No. Week 1 is built for someone who has never trained — wall push-ups, bent-knee rows and bodyweight squats. If a movement in the PDF is beyond you on Day 1, use its regression. Every exercise lists one.",
    },
    {
      q: "I have no pull-up bar and no sturdy table.",
      a: "The pulling work can be done with prone Y-T-W raises, which need nothing but floor space. The dead hang is optional and marked as such. If you can get a doorframe bar, you will get more out of Week 2 onward, but you will not be blocked.",
    },
    {
      q: "Should I do the sessions on consecutive days?",
      a: "No. The schedule deliberately puts two rest days after each heavier day. Tendons and ligaments need that time more than muscle does. If you have to shift a session, keep the order — A, B, C — and skip rather than double up.",
    },
    {
      q: "What if I miss the whole week?",
      a: "Restart the week you missed and continue from there. The program is built in weekly blocks that layer on each other, so a skipped week means repeating that week's progression. Do not jump ahead to the harder variations before the base is solid.",
    },
    {
      q: "Will I look different in 30 days?",
      a: "You will look and feel different in the mirror within two weeks — better posture, and you will know what your body can do. Visible changes in body composition take longer, usually eight to twelve weeks of consistent training and eating. This program is the foundation that makes the next twelve weeks work.",
    },
    {
      q: "Why do you use reps in reserve instead of going to failure?",
      a: "Because failure is a poor teacher. Reps in reserve let you repeat a session next week with the same quality, which is what actually drives progress. Failure training belongs to advanced work with years behind it, not to a beginner's first month.",
    },
    {
      q: "Can I add weights?",
      a: "Not in this program. Bodyweight-only for 30 days is what lets you learn the movements and own the progressions. Once you finish, a loaded variation becomes the obvious next step for most movements.",
    },
    {
      q: "Should I eat more on training days?",
      a: "A little more carbohydrate around training is useful. The protein target does not change. Most people find it easier to eat a consistent amount every day than to switch between training and rest day targets.",
    },
    {
      q: "Why is there a horse-stance-style hold in here?",
      a: "Because it is the best isometric leg builder in the library and it costs nothing. A deep squat hold trains the same qualities as a heavy leg press — strength through a range, with less joint stress and no equipment. It is also a martial arts staple, and this program was written by someone who has done it for years.",
    },
    {
      q: "What comes after the 30 days?",
      a: "On Day 30 you will have benchmark numbers. Those numbers tell you exactly where to go: if your push-up count is low but your squat is strong, you keep squatting and add push volume; if everything is even, you start loading the movements. That plan is built in the next section.",
    },
  ],
}

export const nextSteps = {
  title: "After Day 30",
  intro:
    "The program is not the destination. It is the setup. Here is how to decide what to do next, based on your benchmark rather than on what you feel like doing.",
  steps: [
    {
      heading: "1. Run the benchmark on Day 29",
      body: "One set each of push-ups, table rows, bodyweight squats and a hollow hold. Write the numbers down. Do them fresh, after the warm-up, and stop at genuine technical failure.",
    },
    {
      heading: "2. Find your weakest pattern",
      body: "The lowest number relative to the others is your focus. It is almost always the pull, because most people have never trained rows seriously. That is where the next eight weeks of work should go.",
    },
    {
      heading: "3. Keep the structure, raise the ceiling",
      body: "Three sessions a week, the same A-B-C order, the same warm-up. Now progress the movement you are weakest in, one step up the ladder every two weeks, while the others hold where they are. Changing one variable at a time is how you learn what actually worked.",
    },
    {
      heading: "4. Start loading what you have earned",
      body: "Once a movement is clean and you can stop at failure with form intact, it is ready for weight. A backpack, a water jug, or a pair of dumbbells on the push-up and the split squat is enough to keep progressing for months. You do not need a gym to keep going — you need a plan that still applies when you get past the bodyweight ceiling.",
    },
    {
      heading: "5. Re-test every 8 weeks",
      body: "Same benchmark, same conditions. This is the only reliable way to know whether the last two months worked, and it is the habit that separates people who train for years from people who train for a season.",
    },
  ],
}

export const cta = {
  title: "Where to go next",
  lines: [
    "Train on video. The LB Dluxe channel covers the movements in this program, the progressions, and the mistakes that cost people reps. Search the channel for the exercise you are stuck on.",
    "Follow along. The weekly coaching breakdown, mobility work and the next training block are published here first.",
    "Go deeper. When you are ready for a structured program with programming, progressions and direct feedback, the training programs are in the shop.",
  ],
  shopUrl: "https://shop.lbdluxe.com/fitness",
  siteUrl: "https://lbdluxe.com",
}
