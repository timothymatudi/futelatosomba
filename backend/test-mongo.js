// Quick MongoDB connection test
require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGO_DATABASE_URL.substring(0, 50) + '...');

    await mongoose.connect(process.env.MONGO_DATABASE_URL, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });

    console.log('✅ SUCCESS! MongoDB connected!');
    process.exit(0);
  } catch (err) {
    console.log('❌ FAILED! MongoDB connection error:');
    console.log('Error:', err.message);
    process.exit(1);
  }
};

testConnection();
