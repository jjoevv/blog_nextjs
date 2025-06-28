// 📄 src/app.js
const express = require('express'); //
const cors = require('cors'); // Import necessary modules
const mongoose = require('mongoose'); // Import Mongoose for MongoDB connection
const dotenv = require('dotenv'); // Import dotenv for environment variable management
const postRoutes = require('./routes/post.routes'); // Import post routes

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an Express application
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB using Mongoose
// Ensure you have a .env file with MONGODB_URI set
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, // Use new URL parser to avoid deprecation warnings
  useUnifiedTopology: true // Use unified topology to avoid deprecation warnings
}).then(() => console.log('✅ Connected to MongoDB')) // Log success message on successful connection
  .catch(err => console.error('❌ MongoDB connection error:', err)); // Log error message on connection failure

app.use('/api/posts', postRoutes); // Use post routes for handling /api/posts requests

module.exports = app; // Export the app for use in server.js
// This allows the server to import and use this app configuration