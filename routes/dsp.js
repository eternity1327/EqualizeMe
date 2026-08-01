const express = require('express');
const router = express.Router();
const dsp = require('../utils/camillaDsp');
const adaptiveTest = require('../utils/adaptiveTest');
const { readDB, writeDB } = require('../data/db');

// POST /api/dsp/play
// body: { preset: "bass" | "balanced" | "detail" }
// Plays the bundled test sample through that preset's filter settings.
router.post('/play', (req, res) => {
  const { preset } = req.body;

  if (!preset || !dsp.PRESETS[preset]) {
    return res.status(400).json({
      error: `preset must be one of: ${Object.keys(dsp.PRESETS).join(', ')}`,
    });
  }

  const result = dsp.playPreset(preset);

  if (!result.ok) {
    return res.status(503).json({ error: 'CamillaDSP not ready yet, try again in a moment' });
  }

  res.json({ preset, params: result.params, status: 'playing' });
});

// ---------------------------------------------------------------------
// Adaptive A/B listening test (staircase method)
// ---------------------------------------------------------------------

// POST /api/dsp/adaptive/start
// Begins a new adaptive test session, returns the first pair to compare.
router.post('/adaptive/start', (req, res) => {
  const pair = adaptiveTest.startSession();
  res.json(pair);
});

// POST /api/dsp/adaptive/play
// body: { side: "A" | "B" }
// Plays the test sample through the current round's A or B filter settings.
router.post('/adaptive/play', (req, res) => {
  const { side } = req.body;
  if (side !== 'A' && side !== 'B') {
    return res.status(400).json({ error: 'side must be "A" or "B"' });
  }

  const pair = adaptiveTest.getCurrentPair();
  if (!pair) {
    return res.status(400).json({ error: 'No active test. Call /adaptive/start first.' });
  }

  const params = pair[side];
  const result = dsp.applyFilters(params);

  if (!result.ok) {
    return res.status(503).json({ error: 'CamillaDSP not ready yet, try again in a moment' });
  }

  res.json({ side, params, status: 'playing' });
});

// POST /api/dsp/adaptive/answer
// body: { preferred: "A" | "B" }
// Records the answer, narrows the range, and returns either the next pair
// or the finished profile once all parameters have converged.
router.post('/adaptive/answer', (req, res) => {
  const { preferred } = req.body;
  const result = adaptiveTest.recordAnswer(preferred);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  if (result.done) {
    const db = readDB();
    db.profile = db.profile || {};
    db.profile.eqProfile = result.profile;
    writeDB(db);
    return res.json({ done: true, profile: result.profile });
  }

  res.json({ done: false, next: result.next });
});

module.exports = router;
