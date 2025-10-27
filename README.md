# Virtual Physics Lab
**Created by**: Ryota Takenaka

**Live Site**: https://visual-physics-lab.web.app

## Overview
Interactive web-based physics laboratory for learning classical mechanics through simulations and quizzes. Includes projectile (parabolic) motion and circular motion simulations, quizzes with scoring, and authenticated user history.

## How to Run

### 1. Install Dependencies (Functions)
```bash
cd Back_End/functions
npm install
```

### 2. Start Locally with Firebase Emulator Suite
```bash
cd ../
firebase emulators:start
```

**Default local ports** (from `firebase.json`):
- Hosting:   http://localhost:5002
- Functions: http://localhost:5001
- Firestore: http://localhost:8090
- Auth:      http://localhost:9099
- Emulator UI: http://localhost:4000

### 3. Deploy (Optional)
```bash
firebase deploy                  # all
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore
```

### 4. Optional: Standalone API Server (Railway/Local)
Requires `FIREBASE_SERVICE_ACCOUNT` env (JSON) or `serviceAccountKey.json` in `Back_End/functions`
```bash
cd Back_End/functions
node server.js
```
- Server: http://localhost:3000
- API Docs: http://localhost:3000/api-docs

## ## Project Structure
The following is the complete structure under `midterm-VPL/`. Files listed in `.gitignore` are excluded.

```
midterm-VPL/
├── .firebaserc
├── .github/
│   └── workflows/
│       └── firebase-deploy.yml
├── .gitignore
├── Back_End/
│   ├── .nvmrc
│   ├── README.md
│   ├── firestore.rules
│   └── functions/
│       ├── index.js
│       ├── openapi.yaml
│       ├── package-lock.json
│       ├── package.json
│       └── server.js
├── Front_End/
│   ├── about.html
│   ├── auth.html
│   ├── history.html
│   ├── index.html
│   ├── materials.html
│   ├── package-lock.json
│   ├── package.json
│   ├── quiz.html
│   ├── scripts/
│   │   ├── auth-email.js
│   │   ├── auth.js
│   │   ├── cloud.js
│   │   ├── main.js
│   │   ├── quiz.js
│   │   └── sim/
│   │       ├── circular_motion.js
│   │       └── parabolic.js
│   ├── signup.html
│   ├── simulation.html
│   └── styles/
│       └── base.css
├── README.md
├── SETUP.md
├── firebase.json
└── firestore.indexes.json
```

## ## API Endpoints

### Base URLs
- **Production** (Functions v2 managed): https://api-zldmksklha-uc.a.run.app
- **Local** (Emulators): http://localhost:5001/visual-physics-lab/us-central1/api
- **Local** (Standalone server): http://localhost:3000/api

**All endpoints require header**: `Authorization: Bearer <Firebase ID Token>`

### GET `/api/runs`
Returns the authenticated user's simulation runs (max 50, desc).

### GET `/api/runs/:id`
Returns a single simulation run by ID (owner only).

### GET `/api/simulation-runs`
Alias list of runs for the authenticated user (max 50, desc).

### POST `/api/runs`
Create a simulation run. Body depends on `simType`.

**Example (projectile)**:
```json
{
  "simType": "projectile",
  "v0": 25.0,
  "angle": 45.0,
  "h0": 0.0,
  "g": 9.81,
  "T": 3.61,
  "R": 63.77,
  "hMax": 15.94
}
```

**Example (circular_motion)**:
```json
{
  "simType": "circular_motion",
  "v": 25.0,
  "r": 50.0,
  "bank": 15.0,
  "mu": 0.3,
  "g": 9.81,
  "lapTime": 12.57,
  "ac": 12.5,
  "omega": 0.5
}
```

### POST `/api/quiz-results`
Save a quiz result.
```json
{
  "category": "projectile",
  "score": 7,
  "total": 9,
  "percentage": 78,
  "answers": { "q1": true }
}
```

### GET `/api/quiz-results`
Returns the authenticated user's quiz results (max 50, desc).

### Interactive API Docs
- **Emulators**: http://localhost:5001/visual-physics-lab/us-central1/api/docs
- **Production**: https://api-zldmksklha-uc.a.run.app/api/docs
- **Standalone**: http://localhost:3000/api-docs

## Application Features

## Application Features
- **Authentication**: Google and Email/Password with Firebase Authentication
- **Simulations**: Projectile and Circular motion with real-time visualization
- **Quiz**: 9 questions across 3 categories with instant scoring
- **History**: View past quiz scores and simulation runs
- **Cloud Sync**: Firestore-backed persistence per user
- **Responsive UI** with a simple neumorphism style

## Troubleshooting
- **Cannot connect to API**: Ensure emulators are running; check ports 5001/5002/8090/9099/4000
- **Missing or invalid token**: Sign in via the app; pass Firebase ID token in Authorization header
- **auth/unauthorized-domain**: Add your domain in Firebase Console → Authentication → Settings → Authorized domains
- **Firebase config on frontend**: Update `Front_End/scripts/auth.js` with your Firebase config
- **Port already in use**: Free the port or change it in `firebase.json`

## Environment Requirements
- Node.js 20+ and npm
- Firebase CLI (`npm i -g firebase-tools`)
- A Firebase project
- Modern browser (Chrome/Firefox/Edge)

## Documentation
- **Setup (EN)**: `SETUP.md`
- **Setup (JP)**: `docs/SETUP_JP.md`
- **Authentication Plan**: `docs/AUTHENTICATION_PLAN.md`
- **Data Model and Storage**: `docs/DATA_GUIDE.md`, `docs/DATA_STORAGE.md`
- **Security**: `docs/SECURITY_EXPLAINED.md`

## About
Academic project for learning and demonstration purposes.

**Last updated**: 2025-10-28
