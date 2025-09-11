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

// === Render Books Page ===
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "books.html"));
});

// === API: Get Books + Reading Sessions ===
router.get("/api", (req, res) => {
  const sql = `
    SELECT 
      b.id,
      b.title,
      b.author,
      CASE
        WHEN EXISTS (
          SELECT 1 FROM reading_session r2
          WHERE r2.book_id = b.id AND r2.in_progress = 1
        ) THEN 'in_progress'
        WHEN EXISTS (
          SELECT 1 FROM reading_session r3
          WHERE r3.book_id = b.id AND r3.completato = 1
        ) THEN 'completed'
        ELSE 'never_read'
      END AS status
    FROM books b
    ORDER BY b.id;
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching books:", err.message);
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
