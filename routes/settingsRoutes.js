const express = require("express");
const { readDB, writeDB } = require("../utils/db");

const router = express.Router();

// GET /api/settings
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.profiles.guest.settings);
});

// PUT /api/settings
// body: { notifications?, darkMode?, autoPlay? } (all booleans)
router.put("/", (req, res) => {
  const db = readDB();
  const settings = db.profiles.guest.settings;

  for (const key of ["notifications", "darkMode", "autoPlay"]) {
    if (req.body[key] !== undefined) {
      settings[key] = Boolean(req.body[key]);
    }
  }

  writeDB(db);
  res.json(settings);
});

module.exports = router;
