import React, { useEffect, useRef, useState } from 'react';
import ProfileForm from './components/ProfileForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import WorkoutPlan from './components/WorkoutPlan.jsx';
import MealPlan from './components/MealPlan.jsx';
import { generatePlan, getProgress, saveProgress, getDashboard } from './api.js';

const todayLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric'
});

export default function App() {
  const [profile, setProfile] = useState({
    age: 30,
    weight: 75,
    height: 175,
    gender: 'male',
    activity: '1.375',
    goal: 'maintain'
  });

  const [plan, setPlan] = useState(null);
  const [planDate, setPlanDate] = useState(null);
  const [savedExerciseSets, setSavedExerciseSets] = useState({});
  const [stats, setStats] = useState({ daysActive: 0, setsDone: 0, totalSets: 0, completion: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveTimeout = useRef(null);

  async function refreshDashboard() {
    try {
      const data = await getDashboard();
      setStats(data);
    } catch (e) {
      console.error('Failed to load dashboard stats', e);
    }
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const { date, plan: newPlan } = await generatePlan(profile);
      setPlan(newPlan);
      setPlanDate(date);

      const saved = await getProgress(date);
      setSavedExerciseSets(saved.exerciseSets || {});
      await refreshDashboard();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleProgressChange({ exerciseSets, setsDone, totalSets }) {
    if (!planDate) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      try {
        await saveProgress(planDate, { exerciseSets, setsDone, totalSets });
        await refreshDashboard();
      } catch (e) {
        console.error('Failed to save progress', e);
      }
    }, 300);
  }

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>🏋️ Fitness Planner</h1>
        <span className="header-date">{todayLabel}</span>
      </header>

      <Dashboard stats={stats} goal={profile.goal} />

      <div className="main-grid">
        <ProfileForm
          profile={profile}
          onChange={setProfile}
          onGenerate={handleGenerate}
          loading={loading}
        />

        <div className="card plan-card">
          <h2 className="card-title">
            Today's plan <span className="plan-date">{planDate}</span>
          </h2>

          {error && <div className="error-banner">{error}</div>}

          {!plan && !error && <div className="empty-state">Enter your stats and generate a plan.</div>}

          {plan && (
            <>
              <WorkoutPlan
                workoutName={plan.workoutName}
                exercises={plan.exercises}
                savedExerciseSets={savedExerciseSets}
                onProgressChange={handleProgressChange}
              />
              <MealPlan meals={plan.meals} calorieTarget={plan.calorieTarget} macros={plan.macros} />
            </>
          )}
        </div>
      </div>

      <footer className="app-footer">Progress is saved automatically as you complete each set.</footer>
    </div>
  );
}
