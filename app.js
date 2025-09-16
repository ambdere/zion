// app.js
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Create Express app
const app = express();

// Database connection
const db = new sqlite3.Database('./db/zion.db', (err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to zion.db');
  }
});

// Make DB accessible in routes via app.locals
app.locals.db = db;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser (for future POST/PUT requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes will be added here later, e.g.:
// const gamesRoutes = require('./routes/games');
// app.use('/api/games', gamesRoutes);

// Root route → index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const gamesRoutes = require('./routes/games');
const booksRoutes = require('./routes/books');
const animeRoutes = require('./routes/anime');
app.use('/games', gamesRoutes);
app.use('/books', booksRoutes);
app.use('/anime', animeRoutes);

module.exports = app;
