// Detailed MongoDB connection test
require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection with detailed logging...');
    const url = process.env.MONGO_DATABASE_URL;
    console.log('Full URL:', url);

    mongoose.set('debug', true);

    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('\n✅ SUCCESS! MongoDB connected!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.log('\n❌ FAILED!');
    console.log('Error name:', err.name);
    console.log('Error message:', err.message);
    console.log('Full error:', JSON.stringify(err, null, 2));
    process.exit(1);
  }
};

testConnection();
