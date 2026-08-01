const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../data/db');

const VALID_SOUNDS = ['bass', 'balanced', 'detail'];

// POST /api/test
// body: { sound: "bass" | "balanced" | "detail" }
// Saves the result to test history and updates the user's profile preference
router.post('/', (req, res) => {
  const { sound } = req.body;

  if (!VALID_SOUNDS.includes(sound)) {
    return res.status(400).json({
      error: `sound must be one of: ${VALID_SOUNDS.join(', ')}`
    });
  }

  const db = readDB();

  db.testHistory.push({
    sound,
    takenAt: new Date().toISOString()
  });

  db.profile.preferredSound = sound;

  writeDB(db);

  res.json({
    message: `Preference saved: ${sound}`,
    profile: db.profile
  });
});

module.exports = router;
