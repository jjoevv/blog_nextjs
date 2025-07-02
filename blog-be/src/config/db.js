// 📄 src/db.js


import mongoose from 'mongoose'; // Import mongoose for MongoDB connection

async function connectDB(uri) {
    try {
        mongoose.set('strictQuery', false);     //Allow flexible querying
        await mongoose.connect(uri);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

export default connectDB;
