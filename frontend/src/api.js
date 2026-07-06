const BASE = '/api';

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function generatePlan(profile) {
  const res = await fetch(`${BASE}/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  return handle(res);
}

export async function getProgress(date) {
  const res = await fetch(`${BASE}/progress/${date}`);
  return handle(res);
}

export async function saveProgress(date, data) {
  const res = await fetch(`${BASE}/progress/${date}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handle(res);
}

export async function getDashboard() {
  const res = await fetch(`${BASE}/dashboard`);
  return handle(res);
}
