const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('\n⚠️  FIX: Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)\n');
    process.exit(1);
  }
};

module.exports = connectDB;
