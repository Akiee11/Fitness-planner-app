import React from 'react';

export default function MealPlan({ meals, calorieTarget, macros }) {
  return (
    <div className="plan-block meal-block">
      <h3>Meal plan</h3>
      <ul className="meal-list">
        {meals.map((m, idx) => (
          <li key={idx} className="meal-row">
            <span className="meal-name">
              {m.slot}: {m.name}
            </span>
            <span className="meal-cal">{m.cal} kcal</span>
          </li>
        ))}
      </ul>
      <div className="macro-summary">
        <span>🔥 {calorieTarget} kcal</span>
        <span>Protein {macros.protein}g</span>
        <span>Carbs {macros.carb}g</span>
        <span>Fat {macros.fat}g</span>
      </div>
    </div>
  );
}
