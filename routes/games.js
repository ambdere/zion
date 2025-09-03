const express = require('express');
const router = express.Router();

// Example: GET all games
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const sql = `
    SELECT g.id, g.titolo, g.console, g.copertina,
           s.data_inizio, s.data_fine, s.completato, s.note
    FROM games g
    LEFT JOIN game_sessions s ON g.id = s.game_id
    ORDER BY g.titolo, s.data_inizio
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching games:', err);
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;