const express = require("express");
const { readDB } = require("../utils/db");

const router = express.Router();

// GET /api/recommendations
// Returns IEMs matching the user's saved preferredSound.
// If no test has been taken yet, returns the full catalog.
router.get("/", (req, res) => {
  const db = readDB();
  const preferred = db.profiles.guest.preferredSound;

  const matches = preferred
    ? db.iems.filter((iem) => iem.signature === preferred)
    : db.iems;

  res.json({
    preferredSound: preferred,
    results: matches,
  });
});

module.exports = router;
