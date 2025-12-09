// Script to promote an existing user to admin role
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const promoteToAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Get user identifier from command line
    const userIdentifier = process.argv[2];

    if (!userIdentifier) {
      console.log('\nError: Please provide a username or email');
      console.log('Usage: node scripts/promoteToAdmin.js <username|email>\n');
      console.log('Example:');
      console.log('  node scripts/promoteToAdmin.js john@example.com');
      console.log('  node scripts/promoteToAdmin.js johndoe\n');
      process.exit(1);
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: userIdentifier },
        { email: userIdentifier }
      ]
    });

    if (!user) {
      console.log(`\nError: User not found with identifier: ${userIdentifier}\n`);
      process.exit(1);
    }

    console.log('\n=== User Found ===');
    console.log(`Username: ${user.username}`);
    console.log(`Email: ${user.email}`);
    console.log(`Current Role: ${user.role}`);
    console.log(`Created: ${user.createdAt}`);
    console.log('==================\n');

    if (user.role === 'admin') {
      console.log('User already has admin role. No changes needed.\n');
      process.exit(0);
    }

    // Promote to admin
    const oldRole = user.role;
    user.role = 'admin';
    await user.save();

    console.log('=== User Promoted Successfully ===');
    console.log(`Previous Role: ${oldRole}`);
    console.log(`New Role: admin`);
    console.log(`User: ${user.username} (${user.email})`);
    console.log('===================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\nError promoting user:', error.message);
    process.exit(1);
  }
};

// Show help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('\n=== Promote User to Admin Script ===\n');
  console.log('Usage:');
  console.log('  node scripts/promoteToAdmin.js <username|email>\n');
  console.log('Examples:');
  console.log('  node scripts/promoteToAdmin.js john@example.com');
  console.log('  node scripts/promoteToAdmin.js johndoe\n');
  process.exit(0);
}

promoteToAdmin();
