# Fitness Planner

A simple full-stack fitness planner:

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express (file-based JSON storage, no database setup required)

Generates a daily workout + meal plan from your profile (age, weight, height,
gender, activity level, goal), and lets you tick off each set as you complete
it. Progress and weekly stats are saved on the backend and persist between
visits.

## Project structure

```
fitness-planner-app/
├── backend/          Express API + JSON file storage
│   ├── server.js
│   ├── package.json
│   └── db.json        (auto-created storage file)
└── frontend/          React app (Vite)
    ├── src/
    └── package.json
```

## 1. Run the backend

```bash
cd backend
npm install
npm start
```

The API runs on **http://localhost:5000**.

## 2. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs on **http://localhost:5173** and proxies `/api/*` requests to
the backend automatically (see `vite.config.js`).

Open http://localhost:5173 in your browser.

## How it works

- Fill in your profile on the left and click **Generate today's plan**.
- The backend computes calorie/macro targets (Mifflin-St Jeor formula) and
  picks a workout routine + meals for the day.
- Click the numbered circles on each exercise to mark sets as done — this
  autosaves to the backend (`backend/db.json`).
- The dashboard at the top shows your weekly days-active, sets completed,
  and overall completion percentage.

## Notes

- Storage is a single `db.json` file on the backend for simplicity — good
  for local use or a demo, not for multi-user production deployments.
- To reset all progress, stop the backend and delete/empty `backend/db.json`
  (or just replace its contents with `{"progress": {}}`).
