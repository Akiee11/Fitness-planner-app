const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// ---------- tiny file-based "database" ----------
function readDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { progress: {} };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

if (!fs.existsSync(DB_FILE)) {
  writeDB({ progress: {} });
}

// ---------- exercise library ----------
const exerciseDB = {
  lose: {
    upper: [
      { name: 'Push-ups (wide)', sets: 4, reps: '15-20' },
      { name: 'Dumbbell rows', sets: 4, reps: '12-15' },
      { name: 'Arnold press', sets: 3, reps: '10-12' },
      { name: 'Face pulls', sets: 3, reps: '15-18' },
      { name: 'Bicycle crunches', sets: 3, reps: '20/side' }
    ],
    lower: [
      { name: 'Goblet squats', sets: 4, reps: '15-20' },
      { name: 'Walking lunges', sets: 3, reps: '12/leg' },
      { name: 'Romanian deadlifts', sets: 3, reps: '12-15' },
      { name: 'Calf raises', sets: 4, reps: '20-25' },
      { name: 'Mountain climbers', sets: 3, reps: '30s' }
    ],
    full: [
      { name: 'Kettlebell swings', sets: 4, reps: '15-20' },
      { name: 'Burpees', sets: 3, reps: '10-12' },
      { name: 'Renegade rows', sets: 3, reps: '10/side' },
      { name: 'Thrusters', sets: 3, reps: '12-15' },
      { name: 'Plank jacks', sets: 3, reps: '20' }
    ],
    recovery: [
      { name: 'Yoga flow', sets: 1, reps: '20 min' },
      { name: 'Plank hold', sets: 3, reps: '45s' },
      { name: 'Glute bridges', sets: 3, reps: '20' },
      { name: 'Cat-cow stretch', sets: 2, reps: '10' }
    ]
  },
  maintain: {
    upper: [
      { name: 'Bench press (dumbbell)', sets: 3, reps: '8-12' },
      { name: 'Pull-ups (assisted)', sets: 3, reps: '6-10' },
      { name: 'Seated shoulder press', sets: 3, reps: '8-10' },
      { name: 'Tricep pushdowns', sets: 3, reps: '12-15' },
      { name: 'Hammer curls', sets: 3, reps: '10-12' }
    ],
    lower: [
      { name: 'Barbell squats', sets: 4, reps: '8-10' },
      { name: 'Leg press', sets: 4, reps: '10-12' },
      { name: 'Lying leg curls', sets: 3, reps: '12-15' },
      { name: 'Calf raises', sets: 4, reps: '15-20' },
      { name: 'Ab wheel rollouts', sets: 3, reps: '10-12' }
    ],
    full: [
      { name: 'Deadlifts (RDL)', sets: 3, reps: '8-10' },
      { name: 'Dumbbell cleans', sets: 3, reps: '8-10' },
      { name: 'Push press', sets: 3, reps: '8-10' },
      { name: "Farmer's walk", sets: 3, reps: '30m' },
      { name: 'Hanging leg raises', sets: 3, reps: '12' }
    ],
    recovery: [
      { name: 'Mobility drills', sets: 1, reps: '15 min' },
      { name: 'Side planks', sets: 3, reps: '30s/side' },
      { name: 'Bird dogs', sets: 3, reps: '12/side' },
      { name: 'Foam rolling', sets: 1, reps: '10 min' }
    ]
  },
  gain: {
    upper: [
      { name: 'Incline bench press', sets: 4, reps: '6-8' },
      { name: 'Bent-over rows (barbell)', sets: 4, reps: '6-8' },
      { name: 'Dumbbell lateral raises', sets: 4, reps: '10-12' },
      { name: 'Skull crushers', sets: 3, reps: '8-10' },
      { name: 'Barbell curls', sets: 4, reps: '8-10' }
    ],
    lower: [
      { name: 'Back squats', sets: 5, reps: '5-7' },
      { name: 'Romanian deadlifts', sets: 4, reps: '8-10' },
      { name: 'Bulgarian split squats', sets: 3, reps: '8-10/leg' },
      { name: 'Leg extensions', sets: 3, reps: '10-12' },
      { name: 'Seated calf raises', sets: 4, reps: '12-15' }
    ],
    full: [
      { name: 'Power cleans', sets: 4, reps: '5-7' },
      { name: 'Weighted pull-ups', sets: 4, reps: '6-8' },
      { name: 'Dumbbell shoulder press', sets: 4, reps: '8-10' },
      { name: 'Hex bar deadlift', sets: 4, reps: '6-8' },
      { name: 'Pallof press', sets: 3, reps: '10/side' }
    ],
    recovery: [
      { name: 'Active recovery walk', sets: 1, reps: '20 min' },
      { name: 'Band pull-aparts', sets: 3, reps: '15' },
      { name: 'Core stability hold', sets: 3, reps: '30s' },
      { name: 'Stretching', sets: 1, reps: '10 min' }
    ]
  }
};

// ---------- meal library ----------
const mealDB = {
  breakfast: [
    { name: 'Oats & banana', cal: 350 },
    { name: 'Greek yogurt & berries', cal: 300 },
    { name: 'Veggie omelette & toast', cal: 420 },
    { name: 'Protein smoothie', cal: 380 }
  ],
  lunch: [
    { name: 'Grilled chicken & rice', cal: 600 },
    { name: 'Salmon & quinoa salad', cal: 580 },
    { name: 'Turkey wrap & side salad', cal: 520 },
    { name: 'Tofu stir-fry & rice', cal: 540 }
  ],
  dinner: [
    { name: 'Lean beef & sweet potato', cal: 620 },
    { name: 'Baked fish & steamed veg', cal: 540 },
    { name: 'Chicken stir-fry & noodles', cal: 560 },
    { name: 'Bean chili & rice', cal: 520 }
  ],
  snack: [
    { name: 'Apple & peanut butter', cal: 220 },
    { name: 'Protein bar', cal: 200 },
    { name: 'Mixed nuts', cal: 210 },
    { name: 'Cottage cheese & fruit', cal: 190 }
  ]
};

function pickOne(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function computePlan({ age, weight, height, gender, activity, goal }) {
  const bmr =
    gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  let calorieTarget = bmr * activity;
  if (goal === 'lose') calorieTarget -= 400;
  else if (goal === 'gain') calorieTarget += 350;
  calorieTarget = Math.round(Math.max(calorieTarget, 1200));

  const proteinPerKg = goal === 'maintain' ? 1.8 : 2.0;
  const protein = Math.max(Math.round(weight * proteinPerKg), 80);
  const fat = Math.max(Math.round((calorieTarget * 0.28) / 9), 40);
  const carb = Math.max(Math.round((calorieTarget - (protein * 4 + fat * 9)) / 4), 100);

  const dayOfWeek = new Date().getDay();
  let routineKey = 'upper';
  if (dayOfWeek % 3 === 1) routineKey = 'lower';
  else if (dayOfWeek % 3 === 2) routineKey = 'full';
  if (dayOfWeek === 0 || dayOfWeek === 6) routineKey = 'recovery';

  const goalExercises = exerciseDB[goal] || exerciseDB.maintain;
  const exercises = (goalExercises[routineKey] || goalExercises.upper).map((ex) => ({
    ...ex
  }));

  const workoutNames = {
    upper: 'Upper Body Strength',
    lower: 'Lower Body Power',
    full: 'Full Body Conditioning',
    recovery: 'Active Recovery / Mobility'
  };

  const meals = [
    { slot: 'Breakfast', ...pickOne(mealDB.breakfast) },
    { slot: 'Lunch', ...pickOne(mealDB.lunch) },
    { slot: 'Dinner', ...pickOne(mealDB.dinner) },
    { slot: 'Snack', ...pickOne(mealDB.snack) }
  ];

  return {
    workoutName: workoutNames[routineKey],
    routineKey,
    calorieTarget,
    macros: { protein, carb, fat },
    exercises,
    meals
  };
}

// ---------- date helpers ----------
function getWeekKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const firstJan = new Date(year, 0, 1);
  const days = Math.floor((d - firstJan) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + firstJan.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

// ---------- routes ----------

// Generate a plan for today based on profile inputs
app.post('/api/plan', (req, res) => {
  const { age, weight, height, gender, activity, goal } = req.body;
  if (!age || !weight || !height || !gender || !activity || !goal) {
    return res.status(400).json({ error: 'Missing required profile fields.' });
  }
  const plan = computePlan({
    age: Number(age),
    weight: Number(weight),
    height: Number(height),
    gender,
    activity: Number(activity),
    goal
  });
  res.json({ date: todayKey(), plan });
});

// Get saved set-completion progress for a given date (defaults to today)
app.get('/api/progress/:date?', (req, res) => {
  const date = req.params.date || todayKey();
  const db = readDB();
  const entry = db.progress[date] || { setsDone: 0, totalSets: 0, exerciseSets: {} };
  res.json({ date, ...entry });
});

// Save set-completion progress for a given date
app.post('/api/progress/:date?', (req, res) => {
  const date = req.params.date || todayKey();
  const { setsDone, totalSets, exerciseSets } = req.body;
  const db = readDB();
  db.progress[date] = {
    setsDone: setsDone || 0,
    totalSets: totalSets || 0,
    exerciseSets: exerciseSets || {}
  };
  writeDB(db);
  res.json({ date, ...db.progress[date] });
});

// Weekly dashboard summary
app.get('/api/dashboard', (req, res) => {
  const db = readDB();
  const currentWeek = getWeekKey(new Date());
  let daysActive = 0;
  let setsDone = 0;
  let totalSets = 0;

  Object.entries(db.progress).forEach(([date, entry]) => {
    if (getWeekKey(date) === currentWeek && entry.totalSets > 0) {
      daysActive++;
      setsDone += entry.setsDone;
      totalSets += entry.totalSets;
    }
  });

  const completion = totalSets > 0 ? Math.round((setsDone / totalSets) * 100) : 0;
  res.json({ daysActive, setsDone, totalSets, completion });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Fitness Planner backend running on http://localhost:${PORT}`);
});
