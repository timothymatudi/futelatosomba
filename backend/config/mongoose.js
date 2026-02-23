const mongoose = require('mongoose');
require('dotenv').config();

// Cache the connection promise on the global object to reuse across
// serverless invocations (Vercel keeps the process alive between warm calls).
let cached = global._mongooseConnection;
if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  // If we already have a ready connection, return immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If a connection attempt is already in progress, wait for it
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  const mongoUrl = process.env.MONGO_DATABASE_URL;

  if (!mongoUrl) {
    console.error('MONGO_DATABASE_URL is not set. Database operations will fail.');
    return null;
  }

  try {
    cached.promise = mongoose.connect(mongoUrl, {
      bufferCommands: false, // Fail fast instead of buffering when disconnected
    });

    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
    return cached.conn;
  } catch (err) {
    cached.promise = null; // Reset so next invocation retries
    console.error('MongoDB Connection Error:', err.message);
    // Don't exit - allow server to run for frontend testing
    return null;
  }
};

module.exports = connectDB;
