const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// VM's DNS can't resolve MongoDB Atlas SRV records; use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_DATABASE_URL;
    console.log('==========================================');
    console.log('DEBUG: Attempting MongoDB connection...');
    console.log('DEBUG: MONGO_DATABASE_URL type:', typeof mongoUrl);
    console.log('DEBUG: MONGO_DATABASE_URL length:', mongoUrl ? mongoUrl.length : 'undefined');
    console.log('DEBUG: MONGO_DATABASE_URL value:', mongoUrl ? mongoUrl.substring(0, 50) + '...' : 'NOT SET');
    console.log('==========================================');

    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connected successfully!');
  } catch (err) {
    console.error('==========================================');
    console.error('❌ MongoDB Connection Error:');
    console.error('Error message:', err.message);
    console.error('Error name:', err.name);
    console.error('⚠️  SERVER CONTINUING WITHOUT DATABASE');
    console.error('⚠️  Registration will not work until MongoDB is fixed');
    console.error('==========================================');
    // Don't exit - allow server to run for frontend testing
    // process.exit(1);
  }
};

module.exports = connectDB;
