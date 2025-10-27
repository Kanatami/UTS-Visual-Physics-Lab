# Setup Instructions

## Quick Start

### 1. Backend Setup & Start

```bash
cd "/Users/ryota/Documents/ITB/Web App/midterm-reorganized/Back_End"
npm install
cd functions
npm install
cd ..
firebase emulators:start
```

**Emulator URLs:**
- Frontend: http://localhost:5002
- Functions API: http://localhost:5001/{PROJECT_ID}/us-central1/api
- Firestore: http://localhost:8090
- Emulator UI: http://localhost:4000
- API Docs: http://localhost:5001/{PROJECT_ID}/us-central1/api/docs

### 2. Frontend Development (Optional - Standalone)

```bash
cd "/Users/ryota/Documents/ITB/Web App/midterm-reorganized/Front_End"
npm install
npm run dev
```

Serves at http://localhost:3000

## Project Structure

```
midterm-reorganized/
├── README.md                      # Main project documentation
│
├── Front_End/                     # Frontend Application
│   ├── index.html                 # Landing page
│   ├── simulation.html            # Simulation page
│   ├── quiz.html                  # Quiz page
│   ├── about.html                 # About page
│   ├── auth.html                  # Authentication page
│   ├── dashboard.html             # User dashboard
│   │
│   ├── scripts/                   # JavaScript
│   │   ├── auth.js                # Firebase authentication
│   │   ├── cloud.js               # Cloud API integration
│   │   ├── main.js                # Main logic
│   │   ├── quiz.js                # Quiz functionality
│   │   └── sim/                   # Simulation modules
│   │       ├── parabolic.js       # Projectile motion
│   │       └── circular_motion.js # Circular motion
│   │
│   ├── styles/                    # CSS
│   │   └── base.css               # Neumorphism styling
│   │
│   ├── assets/                    # Static files
│   ├── package.json               # Frontend dependencies
│   ├── .gitignore
│   └── README.md
│
└── Back_End/                      # Backend Application
    ├── functions/                 # Cloud Functions
    │   ├── index.js               # API endpoints
    │   ├── openapi.yaml           # API documentation
    │   └── package.json           # Backend dependencies
    │
    ├── firebase.json              # Firebase config
    ├── firestore.rules            # Database rules
    ├── .firebaserc                # Firebase project
    ├── .nvmrc                     # Node version
    ├── .gitignore
    └── README.md

```

## Key Features

### Frontend
- ✅ Neumorphic design system
- ✅ Multiple physics simulations (Projectile, Circular Motion)
- ✅ Interactive quiz system
- ✅ Firebase authentication
- ✅ Responsive layout

### Backend
- ✅ Firebase Cloud Functions (v2)
- ✅ Firestore database
- ✅ JWT authentication
- ✅ REST API with OpenAPI docs
- ✅ CORS enabled

## API Endpoints

- `GET /api/runs` - List user's simulation runs
- `POST /api/runs` - Create new simulation run
- `GET /api/runs/:id` - Get specific run
- `POST /api/quiz-results` - Save quiz results

## Development Workflow

1. **Backend Development:**
   - Edit files in `Back_End/functions/`
   - Firebase emulators auto-reload on changes
   - Test with Postman or API docs

2. **Frontend Development:**
   - Edit HTML/CSS/JS in `Front_End/`
   - View changes at http://localhost:5002 (Firebase Hosting)
   - Or use `npm run dev` for standalone server

3. **Testing:**
   - Use Firebase Emulator UI at http://localhost:4000
   - Check Firestore data
   - View function logs

## Deployment

```bash
cd Back_End

# Deploy everything
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only hosting (frontend)
firebase deploy --only hosting

# Deploy firestore rules
firebase deploy --only firestore:rules
```

## Environment Variables

Update Firebase config in `Front_End/scripts/auth.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ... other config
};
```

## Advantages of This Structure

1. **Separation of Concerns** - Frontend and backend are independent
2. **Easier Testing** - Test each layer separately
3. **Flexible Deployment** - Deploy frontend/backend independently
4. **Better Organization** - Clear file structure
5. **Team Collaboration** - Frontend/backend teams can work in parallel
6. **Scalability** - Easy to add new features or services

## Next Steps

1. Install dependencies in both folders
2. Start Firebase emulators
3. Open http://localhost:5002 in browser
4. Sign in with Google
5. Try the simulations and quiz
6. View saved data in Firestore (Emulator UI)

## Troubleshooting

**Problem:** Firebase emulators won't start
- Solution: Check Node.js version (should be 20)
- Run: `node --version`
- Use: `nvm use 20` if needed

**Problem:** Frontend can't connect to API
- Solution: Check CORS settings in `functions/index.js`
- Ensure Firebase auth is initialized

**Problem:** "Module not found" errors
- Solution: Run `npm install` in both `Back_End` and `Back_End/functions`

## Support

For issues, check:
- Firebase Console: https://console.firebase.google.com
- Firebase Docs: https://firebase.google.com/docs
- OpenAPI spec: `Back_End/functions/openapi.yaml`
