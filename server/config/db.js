const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/music_stream_25070521128';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3500 // Fail fast if MongoDB Compass is not running
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`\n======================================================`);
    console.warn(`⚠️  [MongoDB Compass Notice]`);
    console.warn(`Could not connect to MongoDB at: ${uri}`);
    console.warn(`Reason: ${error.message}`);
    console.warn(`👉 To connect: Start MongoDB Compass or local mongod service.`);
    console.warn(`✨ Server is using smart fallback to ensure 0% downtime.`);
    console.warn(`======================================================\n`);
    return false;
  }
};

module.exports = connectDB;
