const express = require("express");
const { readDB, writeDB } = require("../utils/db");

const router = express.Router();

// GET /api/profile
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.profiles.guest);
});

// PUT /api/profile
// body: { name?, favoriteGenre? }
router.put("/", (req, res) => {
  const { name, favoriteGenre } = req.body;
  const db = readDB();

  if (name !== undefined) db.profiles.guest.name = name;
  if (favoriteGenre !== undefined) db.profiles.guest.favoriteGenre = favoriteGenre;

  writeDB(db);
  res.json(db.profiles.guest);
});

module.exports = router;
