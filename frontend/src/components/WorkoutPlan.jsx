import React, { useEffect, useState } from 'react';

export default function WorkoutPlan({ workoutName, exercises, savedExerciseSets, onProgressChange }) {
  // exerciseSets: { [exerciseIndex]: boolean[] } — true = that set is done
  const [exerciseSets, setExerciseSets] = useState({});

  // (Re)initialize whenever a new plan/exercise list arrives
  useEffect(() => {
    const initial = {};
    exercises.forEach((ex, idx) => {
      const saved = savedExerciseSets?.[idx];
      initial[idx] =
        Array.isArray(saved) && saved.length === ex.sets
          ? saved
          : Array(ex.sets).fill(false);
    });
    setExerciseSets(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises]);

  useEffect(() => {
    if (Object.keys(exerciseSets).length === 0) return;
    let setsDone = 0;
    let totalSets = 0;
    Object.values(exerciseSets).forEach((arr) => {
      totalSets += arr.length;
      setsDone += arr.filter(Boolean).length;
    });
    onProgressChange({ exerciseSets, setsDone, totalSets });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseSets]);

  function toggleSet(exIdx, setIdx) {
    setExerciseSets((prev) => {
      const updated = { ...prev };
      const arr = [...(updated[exIdx] || [])];
      arr[setIdx] = !arr[setIdx];
      updated[exIdx] = arr;
      return updated;
    });
  }

  return (
    <div className="plan-block">
      <h3>{workoutName}</h3>
      <ul className="exercise-list">
        {exercises.map((ex, exIdx) => {
          const sets = exerciseSets[exIdx] || Array(ex.sets).fill(false);
          const done = sets.filter(Boolean).length;
          const pct = ex.sets > 0 ? Math.round((done / ex.sets) * 100) : 0;
          const complete = pct === 100;

          return (
            <li key={exIdx} className="exercise-row">
              <div className="exercise-info">
                <span className="exercise-name">{ex.name}</span>
                <span className="exercise-meta">
                  {ex.sets} × {ex.reps}
                </span>
                {complete && <span className="complete-badge">✓ Complete</span>}
              </div>
              <div className="exercise-progress">
                <div className="set-tracker">
                  {sets.map((isDone, setIdx) => (
                    <button
                      key={setIdx}
                      className={`set-btn ${isDone ? 'done' : ''}`}
                      onClick={() => toggleSet(exIdx, setIdx)}
                    >
                      {setIdx + 1}
                    </button>
                  ))}
                </div>
                <span className="set-progress-text">
                  {done}/{ex.sets}
                </span>
                <span className={`percentage-label ${complete ? 'complete' : ''}`}>{pct}%</span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
