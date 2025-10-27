const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('./serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Auth middleware
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.substring(7);
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}


app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.post('/api/runs', authenticate, async (req, res) => {
  try {
    const { v0, theta, h0, g, flightTime, range, hMax } = req.body;
    const uid = req.user.uid;

    const docRef = await db.collection('runs').add({
      uid,
      v0: Number(v0),
      theta: Number(theta),
      h0: Number(h0),
      g: Number(g),
      flightTime: Number(flightTime),
      range: Number(range),
      hMax: hMax != null ? Number(hMax) : null,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ id: docRef.id, message: 'Run saved successfully' });
  } catch (error) {
    console.error('Error saving run:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/quiz-results', authenticate, async (req, res) => {
  try {
    const { score, total } = req.body;
    const uid = req.user.uid;

    const docRef = await db.collection('quizResults').add({
      uid,
      score: Number(score),
      total: Number(total),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ id: docRef.id, message: 'Quiz result saved successfully' });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/runs', authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    const snapshot = await db.collection('runs')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const runs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(runs);
  } catch (error) {
    console.error('Error getting runs:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quiz-results', authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    const snapshot = await db.collection('quizResults')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(results);
  } catch (error) {
    console.error('Error getting quiz results:', error);
    res.status(500).json({ error: error.message });
  }
});

// Swagger UI
const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

try {
  const swaggerDocument = yaml.parse(fs.readFileSync(path.join(__dirname, 'openapi.yaml'), 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
  console.log('Swagger documentation not available');
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚂 Railway server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
