// server.js
const app = require('./app');

const PORT = 8042; 
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Zion server running on http://${HOST}:${PORT}`);
});
