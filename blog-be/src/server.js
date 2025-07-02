import 'dotenv/config';

import express from 'express';
import connectDB from './config/db.js'; 

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB(process.env.MONGODB_URI);

app.get('/', (req, res) => {
    res.send('✅ Server is running!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
