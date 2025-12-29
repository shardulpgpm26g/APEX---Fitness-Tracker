
import { Exercise, SplitDay } from './types';

export const MOTIVATIONAL_QUOTES: string[] = [
  "Progress hides in unremarkable days.",
  "You don’t need motivation — you need a routine.",
  "The work counts even when no one sees it.",
  "You train because skipping is easy.",
  "Average days build exceptional outcomes.",
  "The body responds to what you repeat.",
  "Progress is built quietly, then revealed.",
  "Train like today matters because it does.",
  "Show discipline before demanding results.",
  "Power is built one clean rep at a time.",
  "Back days build posture, patience, and power.",
  "If it’s uncomfortable, you’re doing it right.",
  "You leave stronger than you arrived.",
  "Every session is a vote for the person you’re becoming.",
  "You are exactly as disciplined as your results show.",
  "Show up long after motivation leaves.",
  "Respect the weight and the process.",
  "You leave stronger because you chose to stay disciplined.",
  "You don’t need perfect days. You need committed ones.",
  "The body adapts to standards you enforce.",
  "Progress doesn’t announce itself, it accumulates.",
  "The only person you are destined to become is the person you decide to be.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "The resistance that you fight physically in the gym and the resistance that you fight in life can only build a strong character.",
  "Discipline is doing what needs to be done, even if you don't want to do it."
];

export const getDailyMotivationQuote = (): string => {
  const today = new Date();

  // Days since Unix epoch (stable across reloads)
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));

  return MOTIVATIONAL_QUOTES[dayIndex % MOTIVATIONAL_QUOTES.length];
};

export const EXERCISE_DATA: Exercise[] = [
  // ABS
  { id: 'abs-u1', name: 'Decline Crunches', muscleGroup: 'Abs', subGroup: 'Upper Abs' },
  { id: 'abs-u2', name: 'Cable crunches', muscleGroup: 'Abs', subGroup: 'Upper Abs' },
  { id: 'abs-u3', name: 'Bodyweight crunches', muscleGroup: 'Abs', subGroup: 'Upper Abs' },
  { id: 'abs-l1', name: 'Leg raise with hip lift', muscleGroup: 'Abs', subGroup: 'Lower Abs' },
  { id: 'abs-l2', name: 'Leg raise', muscleGroup: 'Abs', subGroup: 'Lower Abs' },
  { id: 'abs-l3', name: 'Hanging leg raise', muscleGroup: 'Abs', subGroup: 'Lower Abs' },
  { id: 'abs-o1', name: 'Russian twist', muscleGroup: 'Abs', subGroup: 'Obliques' },
  { id: 'abs-o2', name: 'Weighted Russian twist', muscleGroup: 'Abs', subGroup: 'Obliques' },
  { id: 'abs-o3', name: 'Cable Russian twist', muscleGroup: 'Abs', subGroup: 'Obliques' },
  { id: 'abs-o4', name: 'Bicycle crunches', muscleGroup: 'Abs', subGroup: 'Obliques' },
  { id: 'abs-c1', name: 'Hand supported V-ups', muscleGroup: 'Abs', subGroup: 'Entire Core' },
  { id: 'abs-c2', name: 'V-ups', muscleGroup: 'Abs', subGroup: 'Entire Core' },

  // CHEST
  { id: 'ch-u1', name: 'Incline barbell Bench press', muscleGroup: 'Chest', subGroup: 'Upper' },
  { id: 'ch-u2', name: 'Incline Dumbbell bench press', muscleGroup: 'Chest', subGroup: 'Upper' },
  { id: 'ch-u3', name: 'Low to high cable fly', muscleGroup: 'Chest', subGroup: 'Upper' },
  { id: 'ch-m1', name: 'Peck deck fly', muscleGroup: 'Chest', subGroup: 'Mid' },
  { id: 'ch-m2', name: 'Dumbbell chest fly', muscleGroup: 'Chest', subGroup: 'Mid' },
  { id: 'ch-m3', name: 'Cable chest fly', muscleGroup: 'Chest', subGroup: 'Mid' },
  { id: 'ch-ml1', name: 'Barbell bench press', muscleGroup: 'Chest', subGroup: 'Mid-Lower' },
  { id: 'ch-ml2', name: 'Dumbbell bench press', muscleGroup: 'Chest', subGroup: 'Mid-Lower' },
  { id: 'ch-l1', name: 'Decline bench press', muscleGroup: 'Chest', subGroup: 'Lower' },
  { id: 'ch-l2', name: 'Seated decline cable press', muscleGroup: 'Chest', subGroup: 'Lower' },
  { id: 'ch-l3', name: 'High to low cable fly', muscleGroup: 'Chest', subGroup: 'Lower' },

  // TRICEPS
  { id: 'tri-lm1', name: 'Rope pushdown', muscleGroup: 'Triceps', subGroup: 'Lateral+Medial' },
  { id: 'tri-lm2', name: 'V-bar pushdown', muscleGroup: 'Triceps', subGroup: 'Lateral+Medial' },
  { id: 'tri-lm3', name: 'Smith machine JM Press', muscleGroup: 'Triceps', subGroup: 'Lateral+Medial' },
  { id: 'tri-lm4', name: 'Lying dumbbell tricep extension', muscleGroup: 'Triceps', subGroup: 'Lateral+Medial' },
  { id: 'tri-lh1', name: 'Overhead rope extension', muscleGroup: 'Triceps', subGroup: 'Long Head' },
  { id: 'tri-lh2', name: 'Single arm overhead dumbbell extension', muscleGroup: 'Triceps', subGroup: 'Long Head' },
  { id: 'tri-ah1', name: 'Dips', muscleGroup: 'Triceps', subGroup: 'All Heads' },
  { id: 'tri-ah2', name: 'Skullcrushers', muscleGroup: 'Triceps', subGroup: 'All Heads' },
  // Arms Day Specific Long Head Stretch
  { id: 'tri-ps1', name: 'Single arm overhead rope extension', muscleGroup: 'Triceps', subGroup: 'Long Head (Stretch)' },
  { id: 'tri-ps2', name: 'Overhead EZ bar extension', muscleGroup: 'Triceps', subGroup: 'Long Head (Stretch)' },
  { id: 'tri-ps3', name: 'Overhead rope extension', muscleGroup: 'Triceps', subGroup: 'Long Head (Stretch)' },
  { id: 'tri-ps4', name: 'Single arm overhead dumbbell extension', muscleGroup: 'Triceps', subGroup: 'Long Head (Stretch)' },
  // Arms Day Specific Long Head Concentration
  { id: 'tri-pc1', name: 'Upright Cable kickback', muscleGroup: 'Triceps', subGroup: 'Long Head (Concentration)' },
  { id: 'tri-pc2', name: 'Tricep cable crossover', muscleGroup: 'Triceps', subGroup: 'Long Head (Concentration)' },
  { id: 'tri-pc3', name: 'Chest supported dumbbell kickback', muscleGroup: 'Triceps', subGroup: 'Long Head (Concentration)' },
  { id: 'tri-pc4', name: 'Bent over cable kickback', muscleGroup: 'Triceps', subGroup: 'Long Head (Concentration)' },

  // SHOULDERS
  { id: 'sh-s1', name: 'Dumbbell lateral raise', muscleGroup: 'Shoulders', subGroup: 'Side Delt' },
  { id: 'sh-s2', name: 'Cable lateral raise', muscleGroup: 'Shoulders', subGroup: 'Side Delt' },
  { id: 'sh-f1', name: 'Dumbbell shoulder press', muscleGroup: 'Shoulders', subGroup: 'Front Delt' },
  { id: 'sh-f2', name: 'Cable front raise', muscleGroup: 'Shoulders', subGroup: 'Front Delt' },
  { id: 'sh-f3', name: 'Dumbbell front raise', muscleGroup: 'Shoulders', subGroup: 'Front Delt' },

  // BACK
  { id: 'ba-lu1', name: 'Wide grip lat pulldown', muscleGroup: 'Back', subGroup: 'Lats+Upper' },
  { id: 'ba-lu2', name: 'Single arm lat pulldown', muscleGroup: 'Back', subGroup: 'Lats+Upper' },
  { id: 'ba-lu3', name: 'Wide grip pull ups', muscleGroup: 'Back', subGroup: 'Lats+Upper' },
  { id: 'ba-lu4', name: 'Half kneeling pulldown', muscleGroup: 'Back', subGroup: 'Lats+Upper' },
  { id: 'ba-lm1', name: 'V bar cable row', muscleGroup: 'Back', subGroup: 'Lats+Mid' },
  { id: 'ba-lm2', name: 'Tripod row', muscleGroup: 'Back', subGroup: 'Lats+Mid' },
  { id: 'ba-lm3', name: 'Chest supported Dumbbell row', muscleGroup: 'Back', subGroup: 'Lats+Mid' },
  { id: 'ba-lm4', name: 'Single arm cable row', muscleGroup: 'Back', subGroup: 'Lats+Mid' },
  { id: 'ba-ub1', name: 'Chest supported Dumbbell high row', muscleGroup: 'Back', subGroup: 'Upper Back' },
  { id: 'ba-ub2', name: 'Dumbbell meadow row', muscleGroup: 'Back', subGroup: 'Upper Back' },
  { id: 'ba-ub3', name: 'Wide grip cable row', muscleGroup: 'Back', subGroup: 'Upper Back' },
  { id: 'ba-la1', name: 'Cable rope pullover', muscleGroup: 'Back', subGroup: 'Lats' },
  { id: 'ba-la2', name: 'Cable W-bar pullover', muscleGroup: 'Back', subGroup: 'Lats' },
  { id: 'ba-la3', name: 'Dumbbell lat pullover', muscleGroup: 'Back', subGroup: 'Lats' },
  { id: 'ba-tr1', name: 'Smith Machine Shrug', muscleGroup: 'Back', subGroup: 'Traps' },
  { id: 'ba-tr2', name: 'Standing dumbbell shrug', muscleGroup: 'Back', subGroup: 'Traps' },
  { id: 'ba-tr3', name: 'Cable shrug', muscleGroup: 'Back', subGroup: 'Traps' },
  { id: 'ba-rd1', name: 'Rear delt cable fly', muscleGroup: 'Back', subGroup: 'Rear Delts' },
  { id: 'ba-rd2', name: 'Rear delt raise', muscleGroup: 'Back', subGroup: 'Rear Delts' },
  { id: 'ba-rd3', name: 'Reverse peck dec fly', muscleGroup: 'Back', subGroup: 'Rear Delts' },
  { id: 'ba-rd4', name: 'Chest supported reverse fly', muscleGroup: 'Back', subGroup: 'Rear Delts' },

  // BICEPS
  { id: 'bi-lo1', name: 'Seated incline curl', muscleGroup: 'Biceps', subGroup: 'Long' },
  { id: 'bi-lo2', name: 'Seated outward curl', muscleGroup: 'Biceps', subGroup: 'Long' },
  { id: 'bi-lo3', name: 'Behind the back cable curl', muscleGroup: 'Biceps', subGroup: 'Long' },
  { id: 'bi-lo4', name: 'Drag curl', muscleGroup: 'Biceps', subGroup: 'Long' },
  { id: 'bi-sh1', name: 'Wide grip barbell curl', muscleGroup: 'Biceps', subGroup: 'Short' },
  { id: 'bi-sh2', name: 'Concentration curl', muscleGroup: 'Biceps', subGroup: 'Short' },
  { id: 'bi-sh3', name: 'Single arm preacher curl', muscleGroup: 'Biceps', subGroup: 'Short' },
  { id: 'bi-sh4', name: 'Spider curl', muscleGroup: 'Biceps', subGroup: 'Short' },
  { id: 'bi-br1', name: 'Cable Hammer curl', muscleGroup: 'Biceps', subGroup: 'Brachialis' },
  { id: 'bi-br2', name: 'Dumbbell Hammer curl', muscleGroup: 'Biceps', subGroup: 'Brachialis' },
  { id: 'bi-br3', name: 'Cross body curl', muscleGroup: 'Biceps', subGroup: 'Brachialis' },

  // LEGS
  { id: 'lg-q1', name: 'Leg press', muscleGroup: 'Quads', subGroup: 'Quads' },
  { id: 'lg-q2', name: 'Bulgarian split squat (Narrow stance)', muscleGroup: 'Quads', subGroup: 'Quads' },
  { id: 'lg-q3', name: 'Barbell squat', muscleGroup: 'Quads', subGroup: 'Quads' },
  { id: 'lg-q4', name: 'Smith machine squat (Narrow stance)', muscleGroup: 'Quads', subGroup: 'Quads' },
  { id: 'lg-qs1', name: 'Leg extensions', muscleGroup: 'Quads', subGroup: 'Quads (Supplement)' },
  { id: 'lg-h1', name: 'Barbell RDL', muscleGroup: 'Hamstrings', subGroup: 'Hamstrings' },
  { id: 'lg-h2', name: 'Cable RDL', muscleGroup: 'Hamstrings', subGroup: 'Hamstrings' },
  { id: 'lg-h3', name: 'Dumbbell RDL', muscleGroup: 'Hamstrings', subGroup: 'Hamstrings' },
  { id: 'lg-h4', name: 'Smith Machine RDL', muscleGroup: 'Hamstrings', subGroup: 'Hamstrings' },
  { id: 'lg-hs1', name: 'Leg curls', muscleGroup: 'Hamstrings', subGroup: 'Hamstrings (Supplement)' },
  { id: 'lg-g1', name: 'Glute kickback', muscleGroup: 'Glutes', subGroup: 'Glutes' },
  { id: 'lg-g2', name: 'Bulgarian Split squat (Wide Stance)', muscleGroup: 'Glutes', subGroup: 'Glutes' },
  { id: 'lg-g3', name: 'Hip thrust', muscleGroup: 'Glutes', subGroup: 'Glutes' },
  { id: 'lg-c1', name: 'Seated machine calf raise', muscleGroup: 'Calves', subGroup: 'Calves' },
  { id: 'lg-c2', name: 'Seated Dumbbell calf raise', muscleGroup: 'Calves', subGroup: 'Calves' },
  { id: 'lg-c3', name: 'Standing dumbbell calf raise', muscleGroup: 'Calves', subGroup: 'Calves' },
  { id: 'lg-c4', name: 'Standing smith machine calf raise', muscleGroup: 'Calves', subGroup: 'Calves' },

  // FOREARMS
  { id: 'fo-t1', name: 'Reverse cable wrist curl', muscleGroup: 'Forearms', subGroup: 'Top of Forearm' },
  { id: 'fo-t2', name: 'Single arm reverse cable wrist curl', muscleGroup: 'Forearms', subGroup: 'Top of Forearm' },
  { id: 'fo-t3', name: 'Reverse barbell wrist curl', muscleGroup: 'Forearms', subGroup: 'Top of Forearm' },
  { id: 'fo-t4', name: 'Reverse dumbbell wrist curl', muscleGroup: 'Forearms', subGroup: 'Top of Forearm' },
  { id: 'fo-i1', name: 'Cable wrist curl', muscleGroup: 'Forearms', subGroup: 'Inner Forearm' },
  { id: 'fo-i2', name: 'Behind back cable wrist curl', muscleGroup: 'Forearms', subGroup: 'Inner Forearm' },
  { id: 'fo-i3', name: 'Behind back barbell wrist curl', muscleGroup: 'Forearms', subGroup: 'Inner Forearm' },
  { id: 'fo-i4', name: 'Dumbbell wrist curl', muscleGroup: 'Forearms', subGroup: 'Inner Forearm' },
  { id: 'fo-b1', name: 'Reverse barbell curl', muscleGroup: 'Forearms', subGroup: 'Brachioradialis' },
  { id: 'fo-b2', name: 'Reverse cable curl', muscleGroup: 'Forearms', subGroup: 'Brachioradialis' },
  { id: 'fo-b3', name: 'Reverse EZ bar curl', muscleGroup: 'Forearms', subGroup: 'Brachioradialis' },
  { id: 'fo-b4', name: 'Reverse dumbbell Curl', muscleGroup: 'Forearms', subGroup: 'Brachioradialis' },
];

export const WORKOUT_SPLIT: SplitDay[] = [
  {
    title: 'Day 1 – Push (Chest, Triceps, Shoulders)',
    requirements: [
      { muscleGroup: 'Chest', count: 3, subGroups: ['Upper', 'Lower', 'Mid-Lower'] },
      { muscleGroup: 'Triceps', count: 3, subGroups: ['Lateral+Medial', 'Long Head', 'All Heads'] },
      { muscleGroup: 'Shoulders', count: 2, subGroups: ['Side Delt', 'Front Delt'] },
    ]
  },
  {
    title: 'Day 2 – Pull (Back, Biceps)',
    requirements: [
      { muscleGroup: 'Back', count: 4, subGroups: ['Lats+Upper', 'Lats+Mid', 'Upper Back', 'Lats'] },
      { muscleGroup: 'Biceps', count: 3, subGroups: ['Long', 'Short', 'Brachialis'] },
    ]
  },
  {
    title: 'Day 3 – Legs (Quads, Calves, Shoulders)',
    requirements: [
      { muscleGroup: 'Quads', count: 3, subGroups: ['Quads', 'Quads', 'Quads'] },
      { muscleGroup: 'Quads', count: 1, subGroups: ['Quads (Supplement)'] },
      { muscleGroup: 'Calves', count: 2, subGroups: ['Calves', 'Calves'] },
      { muscleGroup: 'Shoulders', count: 1, subGroups: ['Front Delt'] },
    ]
  },
  { 
    title: 'Day 4 – Arms (Biceps, Triceps, Forearms)',
    requirements: [
      { muscleGroup: 'Biceps', count: 3, subGroups: ['Long', 'Short', 'Brachialis'] },
      { muscleGroup: 'Triceps', count: 3, subGroups: ['Lateral+Medial', 'Long Head (Stretch)', 'Long Head (Concentration)'] },
      { muscleGroup: 'Forearms', count: 3, subGroups: ['Top of Forearm', 'Inner Forearm', 'Brachioradialis'] },
    ]
  },
  {
    title: 'Day 5 – Upper Body (Chest, Back)',
    requirements: [
      { muscleGroup: 'Chest', count: 4, subGroups: ['Upper', 'Mid', 'Mid-Lower', 'Lower'] },
      { muscleGroup: 'Back', count: 3, subGroups: ['Lats+Upper', 'Lats+Mid', 'Upper Back'] },
    ]
  },
  {
    title: 'Day 6 – Legs Variant (Hamstrings, Glutes, Shoulders)',
    requirements: [
      { muscleGroup: 'Hamstrings', count: 2, subGroups: ['Hamstrings', 'Hamstrings'] },
      { muscleGroup: 'Hamstrings', count: 1, subGroups: ['Hamstrings (Supplement)'] },
      { muscleGroup: 'Glutes', count: 3, subGroups: ['Glutes', 'Glutes', 'Glutes'] },
      { muscleGroup: 'Shoulders', count: 1, subGroups: ['Side Delt'] },
    ]
  },
];
