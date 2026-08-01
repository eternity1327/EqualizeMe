const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../data/db');

// GET /api/profile
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.profile);
});

// PUT /api/profile
// body: { name?, preferredSound?, favoriteGenre? }
router.put('/', (req, res) => {
  const db = readDB();
  const { name, preferredSound, favoriteGenre } = req.body;

  if (name !== undefined) db.profile.name = name;
  if (preferredSound !== undefined) db.profile.preferredSound = preferredSound;
  if (favoriteGenre !== undefined) db.profile.favoriteGenre = favoriteGenre;

  writeDB(db);
  res.json(db.profile);
});

module.exports = router;
