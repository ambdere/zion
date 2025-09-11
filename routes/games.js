const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const router = express.Router();

// DB connection
const db = new sqlite3.Database(path.join(__dirname, "../db/zion.db"), (err) => {
  if (err) {
    console.error("DB connection error:", err.message);
  } else {
    console.log("Connected to zion.db");
  }
});

// === Render Games Page ===
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "games.html"));
});

// === API: Get Games + Sessions ===
router.get("/api", (req, res) => {
  const sql = `
  SELECT 
    g.id,
    g.titolo,
    g.console,
    g.series,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM game_session s2
        WHERE s2.game_id = g.id AND s2.in_progress = 1
      ) THEN 'in_progress'
      WHEN EXISTS (
        SELECT 1 FROM game_session s3
        WHERE s3.game_id = g.id AND s3.completato = 1
      ) THEN 'completed'
      ELSE 'never_played'
    END AS status
  FROM games g
  ORDER BY g.series, g.titolo;
`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching games:", err.message);
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(rows);
    }
  });
});


module.exports = router;
