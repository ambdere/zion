// server.js
const app = require('./app');

const PORT = 8042; // chosen port, includes 42 :)

app.listen(PORT, () => {
  console.log(`🚀 Zion server running on http://localhost:${PORT}`);
});
