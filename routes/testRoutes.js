const express = require("express");
const { readDB, writeDB } = require("../utils/db");

const router = express.Router();

const VALID_CHOICES = ["bass", "balanced", "detail"];

// POST /api/test
// body: { choice: "bass" | "balanced" | "detail" }
// Saves the result to the (guest) profile and sends back a friendly label.
router.post("/", (req, res) => {
  const { choice } = req.body;

  if (!VALID_CHOICES.includes(choice)) {
    return res.status(400).json({
      error: `Invalid choice. Must be one of: ${VALID_CHOICES.join(", ")}`,
    });
  }

  const db = readDB();
  db.profiles.guest.preferredSound = choice;
  writeDB(db);

  const labels = {
    bass: "Bass",
    balanced: "Balanced",
    detail: "Clarity",
  };

  res.json({
    choice,
    label: labels[choice],
    message: `You prefer: ${labels[choice]}`,
  });
});

module.exports = router;
