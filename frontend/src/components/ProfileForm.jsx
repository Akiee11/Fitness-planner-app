import React from 'react';

export default function ProfileForm({ profile, onChange, onGenerate, loading }) {
  function update(field, value) {
    onChange({ ...profile, [field]: value });
  }

  return (
    <div className="card">
      <h2 className="card-title">Your profile</h2>
      <div className="form-grid">
        <label className="field">
          <span>Age</span>
          <input
            type="number"
            min="12"
            max="100"
            value={profile.age}
            onChange={(e) => update('age', e.target.value)}
          />
        </label>

        <label className="field">
          <span>Weight (kg)</span>
          <input
            type="number"
            min="30"
            max="250"
            step="0.5"
            value={profile.weight}
            onChange={(e) => update('weight', e.target.value)}
          />
        </label>

        <label className="field">
          <span>Height (cm)</span>
          <input
            type="number"
            min="100"
            max="250"
            step="0.5"
            value={profile.height}
            onChange={(e) => update('height', e.target.value)}
          />
        </label>

        <label className="field">
          <span>Gender</span>
          <select value={profile.gender} onChange={(e) => update('gender', e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label className="field">
          <span>Activity level</span>
          <select value={profile.activity} onChange={(e) => update('activity', e.target.value)}>
            <option value="1.2">Sedentary</option>
            <option value="1.375">Lightly active</option>
            <option value="1.55">Moderately active</option>
            <option value="1.725">Very active</option>
          </select>
        </label>

        <label className="field">
          <span>Goal</span>
          <select value={profile.goal} onChange={(e) => update('goal', e.target.value)}>
            <option value="lose">Lose fat</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Build muscle</option>
          </select>
        </label>
      </div>

      <button className="btn-primary" onClick={onGenerate} disabled={loading}>
        {loading ? 'Generating…' : "Generate today's plan"}
      </button>
    </div>
  );
}
