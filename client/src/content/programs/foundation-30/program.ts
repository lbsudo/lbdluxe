/**
 * THE FOUNDATION 30 — DAY RECOMP
 * Single source of truth for the free beginner calisthenics program.
 *
 * This module drives BOTH the generated PDF (via client/scripts/build-program-pdf.mjs)
 * and the gated landing page. Nothing about the program is written twice: change
 * a prescription here and the PDF and the landing page both move.
 *
 * Long-form editorial content (nutrition, safety, tracking, FAQ) lives in
 * ./guide.ts, which is PDF-only and intentionally not shipped to the browser.
 */

export type Pattern = "push" | "pull" | "legs" | "core" | "conditioning" | "mobility"

export type Equipment = "none" | "optional-bar"

export interface Exercise {
  id: string
  name: string
  pattern: Pattern
  equipment: Equipment
  /** How to set up, in one sentence. */
  setup: string
  /** Execution cues — the things a coach would say out loud. */
  cues: string[]
  /** The mistakes that actually cost people reps or joints. */
  mistakes: string[]
  /** Easier options when the prescribed version is out of reach. */
  regressions: string[]
  /** Harder options once the prescribed version is solid. */
  progressions: string[]
  /** Reserved for form-demo video links. Empty until footage exists. */
  videoUrl?: string
}

export interface Prescription {
  exerciseId: string
  sets: number
  reps: string
  rest: string
  note?: string
}

export interface SessionBlock {
  title: string
  items: Prescription[]
}

export interface Session {
  id: string
  title: string
  focus: string
  minutes: number
  blocks: SessionBlock[]
  finisher?: { exerciseId: string; prescription: string; note?: string }
  cooldown: string[]
}

export interface Week {
  week: number
  title: string
  focus: string
  /** The intent of the week, in one line. */
  intent: string
  /** Calendar days (1-30) this week trains on. */
  trainingDays: number[]
  sessions: Session[]
}

export interface ProgramMeta {
  slug: string
  title: string
  subtitle: string
  brand: string
  tagline: string
  /** Short stat row for the cover and the landing page. */
  stats: { value: string; label: string }[]
  /** What the reader will have when they finish. */
  promise: string[]
  /** Reps-in-reserve guidance, referenced by every session. */
  rir: string
}

export const program: ProgramMeta = {
  slug: "foundation-30",
  title: "The Foundation 30",
  subtitle: "Day Recomp",
  brand: "LB Dluxe",
  tagline: "Thirty days. Three sessions a week. No equipment.",
  stats: [
    { value: "30", label: "Days" },
    { value: "3x", label: "Per Week" },
    { value: "0", label: "Equipment" },
    // Filled in below once the weeks are defined, so the count can never drift
    // out of step with the actual program.
    { value: "", label: "Sessions" },
  ],
  promise: [
    "A repeatable 30-minute session you can run from a floor and a wall.",
    "Every movement with a clear way in and a clear way up.",
    "A progression path that keeps working after the program ends.",
    "A tracking system that tells you whether the plan is working.",
  ],
  rir: "Every set has a target. Stop each set with 2 to 3 good reps still in the tank (RIR 2-3) for the first two weeks, then 1 to 2 (RIR 1-2) from Week 3. If the last rep is a grind, the set is over. Form beats load, every time.",
}

/** The warm-up is identical for every session so it becomes automatic. */
export const warmUp = {
  minutes: 7,
  steps: [
    "1 min — March in place, arm circles, gradually faster.",
    "1 min — Joint prep: wrists, elbows, shoulders, hips, ankles.",
    "1 min — Cat-cow, 10 slow reps, moving with the breath.",
    "1 min — World's greatest stretch, 5 per side.",
    "1 min — 10 squats, 10 glute bridges, 10 reverse lunges.",
    "1 min — Dead hang from a doorway, or straight-arm active hang.",
    "1 min — 10 light pike push-ups to open the shoulders.",
  ],
}

/** Cooldown follows the same rule as the flexibility work: passive after training. */
export const cooldown = {
  minutes: 6,
  steps: [
    "60s — Deep squat hold, elbows pushing the knees out.",
    "45s — PNF couch stretch per side, 2 rounds, contract then relax deeper.",
    "45s — Doorway chest stretch per side.",
    "45s — 90/90 hip switch per side.",
    "60s — Child's pose, long exhales.",
  ],
}

export const exercises: Record<string, Exercise> = {
  "wall-push-up": {
    id: "wall-push-up",
    name: "Wall Push-Up",
    pattern: "push",
    equipment: "none",
    setup: "Hands on a wall at chest height, body in a straight line, feet back from the wall.",
    cues: [
      "Elbows at roughly 45 degrees, not flared to the sides.",
      "Chest travels toward the wall, then away.",
      "Shoulder blades stay down and back the whole time.",
    ],
    mistakes: [
      "Letting the hips sag — brace the midsection before you start.",
      "Crashing the chest into the wall instead of controlling it.",
    ],
    regressions: ["Push on a higher surface — a countertop works."],
    progressions: ["Move the hands lower, then step the feet back."],
  },
  "knee-push-up": {
    id: "knee-push-up",
    name: "Knee Push-Up",
    pattern: "push",
    equipment: "none",
    setup: "Hands under the shoulders, knees on the floor, body in one line from knees to head.",
    cues: [
      "Squeeze the glutes so the hips don't sag.",
      "Lower until the chest touches the floor, then press away.",
      "Full lockout at the top, shoulders packed down.",
    ],
    mistakes: [
      "Hips drifting up into a pike.",
      "Half reps — the chest has to actually reach the floor.",
    ],
    regressions: ["Wall push-up."],
    progressions: ["Take the knees off and go to a full push-up."],
  },
  "push-up": {
    id: "push-up",
    name: "Push-Up",
    pattern: "push",
    equipment: "none",
    setup: "Hands under the shoulders, body in a straight line, toes on the floor.",
    cues: [
      "One straight line from heels to head — no sagging, no piking.",
      "Elbows back at about 45 degrees.",
      "Lock out and squeeze the glutes at the top of every rep.",
    ],
    mistakes: [
      "Head dropping toward the floor instead of the chest travelling.",
      "Hips sagging, which loads the lower back.",
    ],
    regressions: ["Knee push-up."],
    progressions: ["Decline push-up with the feet on a chair."],
  },
  "pike-push-up": {
    id: "pike-push-up",
    name: "Pike Push-Up",
    pattern: "push",
    equipment: "none",
    setup: "Hands on the floor, hips high, legs straight, head travelling toward the floor between the hands.",
    cues: [
      "Hips go up — the steeper the hips, the more the shoulders load.",
      "Lower the crown of the head, not the forehead.",
      "Elbows bend back, not out.",
    ],
    mistakes: [
      "Keeping the hips low so it turns into a regular push-up.",
      "Craning the neck — the head goes straight down.",
    ],
    regressions: ["Elevate the hands on a chair to reduce the range."],
    progressions: ["Walk the feet in closer to the hands to steepen the angle."],
  },
  "decline-push-up": {
    id: "decline-push-up",
    name: "Decline Push-Up",
    pattern: "push",
    equipment: "none",
    setup: "Feet on a chair or step, hands on the floor, body in a straight line.",
    cues: [
      "The higher the feet, the more the chest and shoulders take.",
      "Keep the hips level with the shoulders — don't arch.",
      "Control the descent, press the floor away.",
    ],
    mistakes: [
      "Feet too high and the lower back takes over.",
      "Losing the plank shape at the bottom.",
    ],
    regressions: ["Push-up."],
    progressions: ["Elevate the feet further."],
  },
  "table-row": {
    id: "table-row",
    name: "Table Row",
    pattern: "pull",
    equipment: "none",
    setup: "Lie under a sturdy table, grip the edge, body in a straight line, heels on the floor.",
    cues: [
      "Pull the chest to the table, elbows toward the ribs.",
      "Let the shoulder blades spread at the bottom.",
      "Hips stay level — don't let the body sag.",
    ],
    mistakes: [
      "Using a wobbly table. Test it first — if it moves, don't use it.",
      "Shrugging to the ears instead of pulling with the back.",
    ],
    regressions: ["Bend the knees and make the lever shorter."],
    progressions: ["Extend the body until the heels are off the floor, then add archer rows."],
  },
  "australian-row": {
    id: "australian-row",
    name: "Australian Row",
    pattern: "pull",
    equipment: "none",
    setup: "Under a table, body in a straight line, heels on the floor, pull the chest to the edge.",
    cues: [
      "Same shape as a table row, but the heels are off the floor.",
      "Row to the table, pause for one second, lower under control.",
      "Neck stays long, eyes on the table edge.",
    ],
    mistakes: [
      "Hips sagging toward the floor under load.",
      "Letting the head touch the ground at the bottom.",
    ],
    regressions: ["Table row with heels down."],
    progressions: ["Archer row — pull to one hand at a time."],
  },
  "archer-row": {
    id: "archer-row",
    name: "Archer Row",
    pattern: "pull",
    equipment: "none",
    setup: "Under a table, one hand pulls to the chest while the other arm extends long.",
    cues: [
      "Pull the working elbow all the way to the ribs.",
      "The extended arm stays long and reaches overhead.",
      "Switch sides every set.",
    ],
    mistakes: [
      "Twisting the hips to cheat the pull.",
      "Switching sides too fast to control either rep.",
    ],
    regressions: ["Australian row."],
    progressions: ["Elevate the feet, or hold a light object in the extended hand."],
  },
  "prone-y-tw": {
    id: "prone-y-tw",
    name: "Prone Y-T-W",
    pattern: "pull",
    equipment: "none",
    setup: "Lie face down, arms extended overhead for the Y, out to the sides for the T, elbows bent for the W.",
    cues: [
      "Lift from the upper back, not the neck.",
      "Thumbs point up — that rotates the shoulders into position.",
      "Pause a beat at the top of each shape.",
    ],
    mistakes: [
      "Yanking the head up and compressing the neck.",
      "Rushing through all three shapes with no pause.",
    ],
    regressions: ["Lift one shape at a time with a longer pause."],
    progressions: ["Hold each shape for three seconds."],
  },
  "dead-hang": {
    id: "dead-hang",
    name: "Dead Hang",
    pattern: "pull",
    equipment: "optional-bar",
    setup: "Hang from a doorway frame or a bar with straight arms, shoulders active.",
    cues: [
      "Shoulders stay down — don't hang from the neck.",
      "Breathe slowly into the back ribs.",
      "Come down under control, don't just drop.",
    ],
    mistakes: [
      "Passive hanging with the shoulders shrugged up by the ears.",
      "Swinging or dropping off the bar.",
    ],
    regressions: ["Active hang with bent arms, or a wall hang."],
    progressions: ["Add a scapular pull — squeeze the shoulder blades down and up."],
  },
  "bodyweight-squat": {
    id: "bodyweight-squat",
    name: "Bodyweight Squat",
    pattern: "legs",
    equipment: "none",
    setup: "Feet shoulder width, toes slightly out, arms forward or hands clasped.",
    cues: [
      "Sit down between the hips, not back.",
      "Knees track over the toes.",
      "Chest stays up, heels stay down.",
    ],
    mistakes: [
      "Heels lifting off the floor.",
      "Rounding the lower back at the bottom.",
    ],
    regressions: ["Box squat to a chair."],
    progressions: ["Hold a pause at the bottom for two seconds."],
  },
  "split-squat": {
    id: "split-squat",
    name: "Split Squat",
    pattern: "legs",
    equipment: "none",
    setup: "One foot forward, one foot back, back knee lowers straight down.",
    cues: [
      "Both knees bend to about 90 degrees.",
      "The front shin stays roughly vertical.",
      "Push through the front heel to stand.",
    ],
    mistakes: [
      "Leaning too far forward.",
      "The back knee swinging out to the side.",
    ],
    regressions: ["Hold a wall or chair for balance."],
    progressions: ["Bulgarian split squat, back foot elevated."],
  },
  "bulgarian-split-squat": {
    id: "bulgarian-split-squat",
    name: "Bulgarian Split Squat",
    pattern: "legs",
    equipment: "none",
    setup: "Rear foot on a chair behind you, front foot forward, torso upright.",
    cues: [
      "Stay tall — the torso is a stack over the front foot.",
      "Drop the back knee straight down.",
      "Front foot flat, all pressure through the whole foot.",
    ],
    mistakes: [
      "Standing too close to the chair and jamming the front knee.",
      "Losing balance at the bottom.",
    ],
    regressions: ["Split squat with the back foot on the floor."],
    progressions: ["Pause two seconds at the bottom."],
  },
  "reverse-lunge": {
    id: "reverse-lunge",
    name: "Reverse Lunge",
    pattern: "legs",
    equipment: "none",
    setup: "Step one foot straight back and lower the back knee toward the floor.",
    cues: [
      "The back knee goes down, not forward.",
      "Front shin vertical, front heel down.",
      "Torso stays tall.",
    ],
    mistakes: [
      "Stepping back too short and jamming the front knee.",
      "Letting the torso fall forward.",
    ],
    regressions: ["Hold a wall, or shorten the range."],
    progressions: ["Add a pause at the bottom, or hold weight at the chest."],
  },
  "glute-bridge": {
    id: "glute-bridge",
    name: "Glute Bridge",
    pattern: "legs",
    equipment: "none",
    setup: "On your back, knees bent, feet flat and close to the hips, arms by your sides.",
    cues: [
      "Squeeze the glutes hard at the top.",
      "Push the hips up until the body is a straight line from knee to shoulder.",
      "Ribs stay down — don't arch the lower back.",
    ],
    mistakes: [
      "Hyperextending the lower back instead of driving the hips.",
      "Pushing through the heels so the hamstrings take over.",
    ],
    regressions: ["Reduce the range."],
    progressions: ["Single-leg glute bridge."],
  },
  "single-leg-glute-bridge": {
    id: "single-leg-glute-bridge",
    name: "Single-Leg Glute Bridge",
    pattern: "legs",
    equipment: "none",
    setup: "On your back, one foot planted, the other leg extended.",
    cues: [
      "The planted leg does all the work.",
      "Hips stay level — don't let the free side drop.",
      "Squeeze the glute at the top.",
    ],
    mistakes: [
      "Rotating the hips open.",
      "Pushing with the extended leg.",
    ],
    regressions: ["Two-leg glute bridge."],
    progressions: ["Pause three seconds at the top."],
  },
  "calf-raise": {
    id: "calf-raise",
    name: "Calf Raise",
    pattern: "legs",
    equipment: "none",
    setup: "Stand tall, weight on the balls of the feet, heels off the floor.",
    cues: [
      "Slow up, pause at the top, slow down.",
      "Keep the knees straight and the weight over the big toe.",
      "Full range every rep — heel to floor, then up as high as possible.",
    ],
    mistakes: [
      "Bouncing out of the bottom.",
      "Rolling to the outside of the foot.",
    ],
    regressions: ["Both feet, holding a wall."],
    progressions: ["Single-leg, or pause two seconds at the top."],
  },
  "dead-bug": {
    id: "dead-bug",
    name: "Dead Bug",
    pattern: "core",
    equipment: "none",
    setup: "On your back, arms straight up, knees bent over the hips, lower back pressed into the floor.",
    cues: [
      "Keep the lower back glued to the floor the whole time.",
      "Move the opposite arm and leg at the same time.",
      "Exhale as the limbs extend.",
    ],
    mistakes: [
      "Lower back arching off the floor — that means the range is too big.",
      "Moving the arms and legs separately instead of opposite each other.",
    ],
    regressions: ["Move only the legs, keeping the arms still."],
    progressions: ["Add a 3-second pause at full extension."],
  },
  "front-plank": {
    id: "front-plank",
    name: "Front Plank",
    pattern: "core",
    equipment: "none",
    setup: "On forearms and toes, body in a straight line from ears to heels.",
    cues: [
      "Squeeze the glutes and brace the midsection.",
      "Push the floor away so the upper back stays broad.",
      "Ribs down, hips level.",
    ],
    mistakes: [
      "Hips rising into a pike.",
      "Hips dropping toward the floor.",
    ],
    regressions: ["Forearms on a chair seat."],
    progressions: ["Lift one foot, then the other."],
  },
  "side-plank": {
    id: "side-plank",
    name: "Side Plank",
    pattern: "core",
    equipment: "none",
    setup: "On one forearm, feet stacked or staggered, body in a straight line.",
    cues: [
      "Stack or stagger the feet so you can hold the line.",
      "Push the bottom shoulder away from the ear.",
      "Hips drive forward, not down.",
    ],
    mistakes: [
      "Hips sinking toward the floor.",
      "Neck craning to look forward.",
    ],
    regressions: ["Forearm on a chair seat."],
    progressions: ["Lift the top leg, then hold the bottom arm overhead."],
  },
  "hollow-hold": {
    id: "hollow-hold",
    name: "Hollow Hold",
    pattern: "core",
    equipment: "none",
    setup: "On your back, lower back pressed down, arms by the ears, legs lifted and slightly apart.",
    cues: [
      "The lower back must stay flat on the floor — that is the whole exercise.",
      "Legs straight, arms reaching overhead.",
      "Breathe into the belly, not the chest.",
    ],
    mistakes: [
      "Lower back lifting off the floor to make it easier.",
      "Holding the breath.",
    ],
    regressions: ["Bend the knees and lift the legs less."],
    progressions: ["Add a small shoulder lift, or tuck and extend."],
  },
  "bird-dog": {
    id: "bird-dog",
    name: "Bird Dog",
    pattern: "core",
    equipment: "none",
    setup: "On hands and knees, opposite arm and leg reach long.",
    cues: [
      "Back stays flat — no rotating, no arching.",
      "Reach long rather than high.",
      "Move slowly and hold at full extension.",
    ],
    mistakes: [
      "Twisting the hips to reach further.",
      "Rushing the reps.",
    ],
    regressions: ["Reach the arm only, then the leg only."],
    progressions: ["Hold three seconds at full extension."],
  },
  "mountain-climber": {
    id: "mountain-climber",
    name: "Mountain Climber",
    pattern: "conditioning",
    equipment: "none",
    setup: "In a high plank, drive one knee toward the chest, alternate.",
    cues: [
      "Hips stay level with the shoulders.",
      "Push through the shoulders, not the lower back.",
      "Fast feet, controlled hips.",
    ],
    mistakes: [
      "Hips bouncing up and down with every rep.",
      "Hands creeping forward into a pike.",
    ],
    regressions: ["Hands on a chair, or step the feet slowly."],
    progressions: ["Cross-body knee to opposite elbow."],
  },
  "bear-crawl": {
    id: "bear-crawl",
    name: "Bear Crawl",
    pattern: "conditioning",
    equipment: "none",
    setup: "Hands and feet on the floor, knees an inch off the ground, crawl forward.",
    cues: [
      "Knees stay low, spine stays flat.",
      "Small steps, opposite hand and foot.",
      "Move forward, then back.",
    ],
    mistakes: [
      "Hips bouncing high.",
      "Hands drifting too far ahead of the shoulders.",
    ],
    regressions: ["Crawl in short 5-second bursts."],
    progressions: ["Crawl backwards the whole set."],
  },
  "burpee": {
    id: "burpee",
    name: "Burpee",
    pattern: "conditioning",
    equipment: "none",
    setup: "From standing, squat down, hands to the floor, kick back, push-up, return, stand.",
    cues: [
      "Hands land under the shoulders.",
      "Chest to the floor on the push-up.",
      "Stand up fully before the next rep.",
    ],
    mistakes: [
      "Skipping the push-up to make it faster.",
      "Landing with a rounded lower back.",
    ],
    regressions: ["Step back one leg at a time instead of jumping."],
    progressions: ["Add a tuck jump at the top."],
  },
  "shadowboxing": {
    id: "shadowboxing",
    name: "Shadowboxing Rounds",
    pattern: "conditioning",
    equipment: "none",
    setup: "Fighting stance, hands up, throw combinations at the air.",
    cues: [
      "Stay on the balls of the feet, light on your toes.",
      "Exhale sharply with every strike.",
      "Return the guard to the face after each combination.",
    ],
    mistakes: [
      "Standing flat-footed and square.",
      "Dropping the hands after every punch.",
    ],
    regressions: ["Slow, deliberate rounds with a focus on technique."],
    progressions: ["Longer rounds, or add slips between combinations."],
  },
  "cat-cow": {
    id: "cat-cow",
    name: "Cat-Cow",
    pattern: "mobility",
    equipment: "none",
    setup: "On hands and knees, alternate rounding and extending the spine.",
    cues: [
      "Move with the breath — inhale into the arch, exhale into the round.",
      "Move slowly through the whole range.",
      "Let the head follow the spine.",
    ],
    mistakes: ["Rushing it into a bounce."],
    regressions: ["Smaller range."],
    progressions: ["Add thoracic rotations."],
  },
  "worlds-greatest-stretch": {
    id: "worlds-greatest-stretch",
    name: "World's Greatest Stretch",
    pattern: "mobility",
    equipment: "none",
    setup: "In a lunge, one hand on the floor, the other elbow drops inside the front foot, then rotate and reach up.",
    cues: [
      "Sink the hips forward as you rotate.",
      "Reach the top hand toward the ceiling.",
      "Breathe out as you rotate.",
    ],
    mistakes: ["Rushing the rotation.", "Letting the front knee collapse inward."],
    regressions: ["Widen the stance and stay low."],
    progressions: ["Add a pause in the rotated position."],
  },
  "deep-squat-hold": {
    id: "deep-squat-hold",
    name: "Deep Squat Hold",
    pattern: "mobility",
    equipment: "none",
    setup: "Feet wide, sit into a deep squat, heels down, elbows inside the knees.",
    cues: [
      "Whole foot stays planted.",
      "Elbows push the knees out to stay open.",
      "Breathe slowly, stay relaxed.",
    ],
    mistakes: ["Heels lifting.", "Holding your breath."],
    regressions: ["Shallower squat."],
    progressions: ["Longer holds, or add a light object between the hands."],
  },
  "couch-stretch": {
    id: "couch-stretch",
    name: "PNF Couch Stretch",
    pattern: "mobility",
    equipment: "none",
    setup: "On your back, one leg up against a wall or couch, the other leg extended.",
    cues: [
      "Contract the raised thigh for 10 seconds at 60-80% effort.",
      "Relax for 3 seconds, then sink deeper.",
      "Hold the new depth for 20-30 seconds, 3 rounds.",
    ],
    mistakes: [
      "Maximal contractions — moderate effort works better and is safer.",
      "Forcing the range past a sharp pinch.",
    ],
    regressions: ["Hold at a comfortable angle and work from there."],
    progressions: ["Keep the contract-relax cycle going deeper each round."],
  },
}

/** Ordering for the exercise-library section of the PDF. */
export const exerciseOrder: string[] = [
  "wall-push-up",
  "knee-push-up",
  "push-up",
  "pike-push-up",
  "decline-push-up",
  "table-row",
  "australian-row",
  "archer-row",
  "prone-y-tw",
  "dead-hang",
  "bodyweight-squat",
  "split-squat",
  "bulgarian-split-squat",
  "reverse-lunge",
  "glute-bridge",
  "single-leg-glute-bridge",
  "calf-raise",
  "dead-bug",
  "front-plank",
  "side-plank",
  "hollow-hold",
  "bird-dog",
  "mountain-climber",
  "bear-crawl",
  "burpee",
  "shadowboxing",
  "cat-cow",
  "worlds-greatest-stretch",
  "deep-squat-hold",
  "couch-stretch",
]

const sessionA = (week: number): Session => {
  const t = {
    1: {
      focus: "Push pattern and trunk control.",
      push: [
        { exerciseId: "knee-push-up", sets: 3, reps: "8-12 reps", rest: "60s" },
        { exerciseId: "pike-push-up", sets: 3, reps: "6-10 reps", rest: "75s" },
      ],
      core: [
        { exerciseId: "dead-bug", sets: 3, reps: "8 per side", rest: "45s" },
        { exerciseId: "front-plank", sets: 3, reps: "20-40s", rest: "45s" },
      ],
      finisher: { exerciseId: "mountain-climber", prescription: "3 x 30s, rest 45s", note: "Fast feet, still hips." },
    },
    2: {
      focus: "Full push-up and a longer trunk hold.",
      push: [
        { exerciseId: "push-up", sets: 3, reps: "8-12 reps", rest: "60s" },
        { exerciseId: "pike-push-up", sets: 3, reps: "8-12 reps", rest: "75s" },
      ],
      core: [
        { exerciseId: "dead-bug", sets: 3, reps: "10 per side", rest: "45s" },
        { exerciseId: "hollow-hold", sets: 3, reps: "20-30s", rest: "45s" },
      ],
      finisher: { exerciseId: "mountain-climber", prescription: "4 x 30s, rest 45s" },
    },
    3: {
      focus: "Add a set and find a harder trunk variation.",
      push: [
        { exerciseId: "push-up", sets: 4, reps: "8-12 reps", rest: "60s" },
        { exerciseId: "pike-push-up", sets: 4, reps: "8-12 reps", rest: "75s" },
      ],
      core: [
        { exerciseId: "dead-bug", sets: 3, reps: "12 per side", rest: "45s" },
        { exerciseId: "side-plank", sets: 3, reps: "20-40s per side", rest: "45s" },
      ],
      finisher: { exerciseId: "burpee", prescription: "4 x 8 slow reps, rest 60s", note: "Full push-up every rep." },
    },
    4: {
      focus: "Highest volume of the program. Leave one good rep in reserve.",
      push: [
        { exerciseId: "push-up", sets: 4, reps: "10-15 reps", rest: "60s" },
        { exerciseId: "pike-push-up", sets: 4, reps: "10-14 reps", rest: "75s" },
      ],
      core: [
        { exerciseId: "front-plank", sets: 3, reps: "45-60s", rest: "45s" },
        { exerciseId: "side-plank", sets: 3, reps: "30-45s per side", rest: "45s" },
      ],
      finisher: { exerciseId: "mountain-climber", prescription: "4 x 40s, rest 45s" },
    },
  }[week]!

  return {
    id: "A",
    title: "Push & Core",
    focus: t.focus,
    minutes: 30,
    blocks: [
      { title: "Push", items: t.push },
      { title: "Core", items: t.core },
    ],
    finisher: t.finisher,
    cooldown: cooldown.steps,
  }
}

const sessionB = (week: number): Session => {
  const t = {
    1: {
      focus: "Pull pattern and leg drive.",
      pull: [
        { exerciseId: "table-row", sets: 4, reps: "8-12 reps", rest: "60s" },
        { exerciseId: "prone-y-tw", sets: 3, reps: "8-12 reps", rest: "45s" },
      ],
      legs: [
        { exerciseId: "bodyweight-squat", sets: 4, reps: "10-15 reps", rest: "75s" },
        { exerciseId: "glute-bridge", sets: 3, reps: "12-15 reps", rest: "45s" },
      ],
      finisher: { exerciseId: "reverse-lunge", prescription: "3 x 10 per leg, rest 60s" },
    },
    2: {
      focus: "Longer rows and single-leg glute work.",
      pull: [
        { exerciseId: "table-row", sets: 4, reps: "10-15 reps", rest: "60s" },
        { exerciseId: "dead-hang", sets: 3, reps: "20-40s", rest: "60s", note: "Doorway frame or bar. Skip if unavailable." },
      ],
      legs: [
        { exerciseId: "bodyweight-squat", sets: 4, reps: "12-18 reps", rest: "75s" },
        { exerciseId: "single-leg-glute-bridge", sets: 3, reps: "10-12 per leg", rest: "45s" },
      ],
      finisher: { exerciseId: "reverse-lunge", prescription: "3 x 12 per leg, rest 60s" },
    },
    3: {
      focus: "Harder rows, single-leg legs.",
      pull: [
        { exerciseId: "australian-row", sets: 4, reps: "8-12 reps", rest: "60s" },
        { exerciseId: "prone-y-tw", sets: 3, reps: "12 reps", rest: "45s" },
      ],
      legs: [
        { exerciseId: "split-squat", sets: 4, reps: "8-12 per leg", rest: "75s" },
        { exerciseId: "single-leg-glute-bridge", sets: 3, reps: "12 per leg", rest: "45s" },
      ],
      finisher: { exerciseId: "bear-crawl", prescription: "4 x 20m, rest 60s" },
    },
    4: {
      focus: "Peak pulling volume and the hardest split squat.",
      pull: [
        { exerciseId: "archer-row", sets: 4, reps: "6-10 per side", rest: "60s" },
        { exerciseId: "dead-hang", sets: 4, reps: "30-45s", rest: "60s", note: "Doorway frame or bar. Skip if unavailable." },
      ],
      legs: [
        { exerciseId: "bulgarian-split-squat", sets: 4, reps: "8-12 per leg", rest: "75s" },
        { exerciseId: "single-leg-glute-bridge", sets: 3, reps: "12-15 per leg", rest: "45s" },
      ],
      finisher: { exerciseId: "reverse-lunge", prescription: "3 x 15 per leg, rest 60s" },
    },
  }[week]!

  return {
    id: "B",
    title: "Pull & Legs",
    focus: t.focus,
    minutes: 30,
    blocks: [
      { title: "Pull", items: t.pull },
      { title: "Legs", items: t.legs },
    ],
    finisher: t.finisher,
    cooldown: cooldown.steps,
  }
}

const sessionC = (week: number): Session => {
  const t = {
    1: {
      focus: "Full body and conditioning.",
      main: [
        { exerciseId: "bodyweight-squat", sets: 3, reps: "12-15 reps", rest: "60s" },
        { exerciseId: "knee-push-up", sets: 3, reps: "8-12 reps", rest: "60s" },
        { exerciseId: "table-row", sets: 3, reps: "8-12 reps", rest: "60s" },
        { exerciseId: "bird-dog", sets: 3, reps: "8 per side", rest: "45s" },
      ],
      finisher: { exerciseId: "shadowboxing", prescription: "3 x 90s, rest 30s", note: "Stance, guard, sharp exhale on every strike." },
    },
    2: {
      focus: "More volume on the same patterns.",
      main: [
        { exerciseId: "split-squat", sets: 3, reps: "10 per leg", rest: "60s" },
        { exerciseId: "push-up", sets: 3, reps: "10-15 reps", rest: "60s" },
        { exerciseId: "table-row", sets: 3, reps: "10-15 reps", rest: "60s" },
        { exerciseId: "hollow-hold", sets: 3, reps: "25-35s", rest: "45s" },
      ],
      finisher: { exerciseId: "shadowboxing", prescription: "4 x 90s, rest 30s" },
    },
    3: {
      focus: "Harder variations across the board.",
      main: [
        { exerciseId: "bulgarian-split-squat", sets: 3, reps: "10 per leg", rest: "60s" },
        { exerciseId: "decline-push-up", sets: 3, reps: "8-12 reps", rest: "60s" },
        { exerciseId: "australian-row", sets: 3, reps: "10-14 reps", rest: "60s" },
        { exerciseId: "hollow-hold", sets: 3, reps: "30-45s", rest: "45s" },
      ],
      finisher: { exerciseId: "shadowboxing", prescription: "4 x 2 min, rest 30s" },
    },
    4: {
      focus: "Highest volume session. Quality reps only.",
      main: [
        { exerciseId: "bulgarian-split-squat", sets: 4, reps: "10-12 per leg", rest: "60s" },
        { exerciseId: "decline-push-up", sets: 4, reps: "10-14 reps", rest: "60s" },
        { exerciseId: "archer-row", sets: 4, reps: "8-10 per side", rest: "60s" },
        { exerciseId: "hollow-hold", sets: 4, reps: "40-60s", rest: "45s" },
      ],
      finisher: { exerciseId: "shadowboxing", prescription: "5 x 2 min, rest 30s" },
    },
  }[week]!

  return {
    id: "C",
    title: "Full Body & Conditioning",
    focus: t.focus,
    minutes: 32,
    blocks: [{ title: "Main", items: t.main }],
    finisher: t.finisher,
    cooldown: cooldown.steps,
  }
}

export const weeks: Week[] = [
  {
    week: 1,
    title: "Foundation",
    focus: "Learn the patterns.",
    intent: "Nothing here should feel hard. Learn the positions and get consistent.",
    trainingDays: [1, 3, 5],
    sessions: [sessionA(1), sessionB(1), sessionC(1)],
  },
  {
    week: 2,
    title: "Build",
    focus: "Add reps and rows.",
    intent: "Same movements, more of them. Reps come first before anything gets harder.",
    trainingDays: [8, 10, 12],
    sessions: [sessionA(2), sessionB(2), sessionC(2)],
  },
  {
    week: 3,
    title: "Strength",
    focus: "Harder variations.",
    intent: "Swap in the next progression up and drop to 1-2 reps in reserve.",
    trainingDays: [15, 17, 19],
    sessions: [sessionA(3), sessionB(3), sessionC(3)],
  },
  {
    week: 4,
    title: "Integrate",
    focus: "Peak volume, then test.",
    intent: "The busiest week. Own the reps, then test yourself on Day 29.",
    trainingDays: [22, 24, 26],
    sessions: [sessionA(4), sessionB(4), sessionC(4)],
  },
]

/** Day 29 — the benchmark session. */
export const benchmark: Session = {
  id: "T",
  title: "Benchmark",
  focus: "Test every pattern once, then write the numbers down.",
  minutes: 35,
  blocks: [
    {
      title: "Test — one set each, stop at technical failure",
      items: [
        { exerciseId: "push-up", sets: 1, reps: "Max clean reps", rest: "2 min" },
        { exerciseId: "table-row", sets: 1, reps: "Max clean reps", rest: "2 min" },
        { exerciseId: "bodyweight-squat", sets: 1, reps: "Max clean reps", rest: "2 min" },
        { exerciseId: "hollow-hold", sets: 1, reps: "Max seconds", rest: "2 min" },
      ],
    },
  ],
  finisher: { exerciseId: "shadowboxing", prescription: "3 x 2 min, rest 30s", note: "Not a test. Just finish well." },
  cooldown: cooldown.steps,
}

/** The 30-day map used on the PDF schedule page and the landing page preview. */
export const calendar: { day: number; label: string }[] = (() => {
  const days: { day: number; label: string }[] = []
  const sessionsByDay = new Map<number, string>()
  for (const w of weeks) {
    w.sessions.forEach((s, i) => sessionsByDay.set(w.trainingDays[i], s.id))
  }
  sessionsByDay.set(29, "T")
  for (let d = 1; d <= 30; d++) {
    const s = sessionsByDay.get(d)
    days.push({ day: d, label: s ?? "Rest" })
  }
  return days
})()

/** Total sessions the program contains, for the landing page stat row. */
export const totalSessions = weeks.reduce((n, w) => n + w.sessions.length, 0) + 1

// The session count is derived from the weeks, so the cover, the landing page
// and the document can never disagree about it.
program.stats = program.stats.map((s) =>
  s.label === "Sessions" ? { ...s, value: String(totalSessions) } : s,
)

export function getExercise(id: string): Exercise {
  const e = exercises[id]
  if (!e) throw new Error(`Unknown exercise: ${id}`)
  return e
}
