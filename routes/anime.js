// routes/anime.js
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const router = express.Router();
const db = new sqlite3.Database(path.join(__dirname, "../db/zion.db"));

// === Render Anime Page ===
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "anime.html"));
});

// === API: Get Anime (con stato globale) ===
router.get("/api", (req, res) => {
  const sql = `
    SELECT 
      a.id,
      a.title,
      CASE
        WHEN EXISTS (
          SELECT 1 FROM episodes e2
          WHERE e2.anime_id = a.id AND e2.watched = 0
        ) AND EXISTS (
          SELECT 1 FROM episodes e3
          WHERE e3.anime_id = a.id AND e3.watched = 1
        ) THEN 'in_progress'
        WHEN NOT EXISTS (
          SELECT 1 FROM episodes e4
          WHERE e4.anime_id = a.id AND e4.watched = 0
        ) THEN 'completed'
        ELSE 'never_watched'
      END AS status
    FROM anime a
    ORDER BY a.series;
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching anime:", err.message);
      res.status(500).json({ error: "DB query failed" });
    } else {
      res.json(rows);
    }
  });
});

// === API: Episodi per anime ===
router.get("/:id/episodes", (req, res) => {
  const sql = `
    SELECT 
      saga,
      episode_number,
      title_it,
      title_jp_kanji,
      title_jp_romaji,
      title_literal,
      watched
    FROM episodes
    WHERE anime_id = ?
    ORDER BY episode_number;
  `;
  db.all(sql, [req.params.id], (err, rows) => {
    if (err) {
      console.error("Error fetching episodes:", err.message);
      res.status(500).json({ error: "DB query failed" });
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
