// 📄 src/server.js

const connectDB = require('./config/d'); // Import the database connection function

// Load environment variables
require('dotenv').config();
await connectDB(); // Connect to the MongoDB database