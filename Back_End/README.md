# Virtual Physics Lab - Backend

Firebase Functions backend for the Virtual Physics Lab application.

## Setup

```bash
cd Back_End
npm install
cd functions
npm install
```

## Development

Start the Firebase emulators:

```bash
firebase emulators:start
```

This will start:
- Functions: http://localhost:5001
- Firestore: http://localhost:8090
- Hosting: http://localhost:5002
- Emulator UI: http://localhost:4000

## API Documentation

When the emulators are running, visit:
http://localhost:5001/{PROJECT_ID}/us-central1/api/docs

## Deploy

```bash
firebase deploy
```

Or deploy only functions:
```bash
firebase deploy --only functions
```
