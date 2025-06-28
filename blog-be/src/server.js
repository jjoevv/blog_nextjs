// 📄 src/server.js
const app = require('./app');
const PORT = process.env.PORT || 3000;
// Load environment variables
require('dotenv').config();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`); 
});