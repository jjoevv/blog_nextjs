// 📄 src/db.js


const mongoose = require('mongoose');

async function connectDB(uri) {
    try {
        mongoose.set('strictQuery', false);     //Allow flexible querying
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`✅ Connected to MongoDB at ${uri}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

module.exports = connectDB;
