import React from 'react';

export default function Dashboard({ stats, goal }) {
  const goalLabels = { lose: 'Lose fat', maintain: 'Maintain', gain: 'Build muscle' };

  return (
    <div className="dashboard">
      <div className="stat-card">
        <span className="stat-label">Days active</span>
        <span className="stat-value">{stats.daysActive}</span>
        <span className="stat-sub">this week</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Sets completed</span>
        <span className="stat-value">{stats.setsDone}</span>
        <span className="stat-sub">of {stats.totalSets}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Completion</span>
        <span className="stat-value">{stats.completion}%</span>
        <span className="stat-sub">overall progress</span>
      </div>
      <div className="stat-card accent">
        <span className="stat-label">Today's goal</span>
        <span className="stat-value">{goalLabels[goal] || 'Maintain'}</span>
      </div>
    </div>
  );
}
