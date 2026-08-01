const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../data/db');

// GET /api/settings
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.settings);
});

// PUT /api/settings
// body: { "1": true, "2": false, "3": true }
router.put('/', (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json(db.settings);
});

module.exports = router;
