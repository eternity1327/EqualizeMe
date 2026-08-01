const express = require('express');
const router = express.Router();
const { readDB } = require('../data/db');

// GET /api/recommendations
// Optional query param: ?sound=bass|balanced|detail
// If no query param is given, uses the saved profile's preferredSound
router.get('/', (req, res) => {
  const db = readDB();
  const sound = req.query.sound || db.profile.preferredSound;

  const matches = db.iems.filter(item => item.sound === sound);

  res.json({
    sound,
    results: matches.length ? matches : db.iems
  });
});

module.exports = router;
