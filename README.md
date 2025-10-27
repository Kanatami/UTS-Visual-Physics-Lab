# Virtual Physics Lab

Interactive physics simulations for learning projectile motion, circular motion, and more.

🌐 **Live Demo**: https://visual-physics-lab.web.app

## 🎯 Features

- **Interactive Simulations**: Projectile (Parabolic) Motion and Circular Motion with real-time visualization
- **Zoom & Pan Controls**: Explore simulations with intuitive controls
- **User Authentication**: Google OAuth and Email/Password login
- **Data Persistence**: Save simulation results to Firestore
- **Learning Materials**: Video tutorials and detailed explanations
- **Quiz System**: Test your understanding of physics concepts
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Firebase Authentication** (Compat SDK v10.12.0)
- **Canvas API** for physics visualizations
- **Neumorphism Design System**

### Backend
- **Firebase Cloud Functions v2** (Node.js 20)
- **Express.js** REST API
- **Firestore Database**
- **Firebase Hosting**

### DevOps
- **GitHub Actions** for CI/CD
- **Firebase Emulator Suite** for local development

## Project Structure

```
midterm-reorganized/
├── Front_End/           # Static frontend files
│   ├── index.html
│   ├── simulation.html
│   ├── quiz.html
│   ├── about.html
│   ├── auth.html
│   ├── dashboard.html
│   ├── scripts/         # JavaScript files
│   ├── styles/          # CSS files
│   ├── assets/          # Static assets
│   ├── package.json
│   └── README.md
│
└── Back_End/            # Firebase backend
    ├── functions/       # Cloud Functions
    │   ├── index.js
    │   ├── openapi.yaml
    │   └── package.json
    ├── firebase.json
    ├── firestore.rules
    ├── .firebaserc
    ├── .nvmrc
    └── README.md
```

## Setup

### Backend Setup

```bash
cd Back_End
npm install
cd functions
npm install
```

### Frontend Setup

```bash
cd Front_End
npm install
```

## Development

### Start Backend (Firebase Emulators)

```bash
cd Back_End
firebase emulators:start
```

This starts:
- Functions: http://localhost:5001
- Firestore: http://localhost:8090
- Hosting: http://localhost:5002
- Emulator UI: http://localhost:4000

### Start Frontend (Optional - for standalone development)

```bash
cd Front_End
npm run dev
```

Serves frontend at http://localhost:3000

**Note:** When using Firebase emulators, the frontend is served via Firebase Hosting at http://localhost:5002

## Deployment

From the `Back_End` directory:

```bash
# Deploy everything (recommended for first deployment)
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

## 🚀 Automated Deployment (CI/CD)

This project uses GitHub Actions for automatic deployment:

1. **Push to main branch** → Automatically deploys to Firebase
2. **Pull Request** → Runs tests and preview deployment
3. **Status checks** → See deployment status in GitHub

### Setup GitHub Actions

1. **Get Firebase Service Account Key**:
   ```bash
   firebase init hosting:github
   ```
   This will guide you through setting up GitHub Actions.

2. **Manual Setup** (if needed):
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Project Settings → Service Accounts → Generate New Private Key
   - Add key as `FIREBASE_SERVICE_ACCOUNT` secret in GitHub repo settings

## 📦 Local Development

### Prerequisites
- **Node.js 20+**
- **Firebase CLI**: `npm install -g firebase-tools`
- **Git**

### Setup Steps

1. **Clone repository**:
   ```bash
   git clone https://github.com/Kanatami/virtual-physics-lab.git
   cd virtual-physics-lab
   ```

2. **Install dependencies**:
   ```bash
   cd Back_End/functions
   npm install
   ```

3. **Login to Firebase**:
   ```bash
   firebase login
   ```

4. **Start emulators**:
   ```bash
   cd ../  # Back to Back_End directory
   firebase emulators:start
   ```

5. **Open browser**: http://localhost:5002

## API Documentation

When running, visit the API docs at:
- Emulator: http://localhost:5001/{PROJECT_ID}/us-central1/api/docs
- Production: https://asia-southeast2-{PROJECT_ID}.cloudfunctions.net/api/docs
