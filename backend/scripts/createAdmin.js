// Script to create an admin user
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Get admin details from command line arguments or use defaults
    const username = process.argv[2] || 'admin';
    const email = process.argv[3] || 'admin@futelatosomba.com';
    const password = process.argv[4] || 'Admin@123';
    const firstName = process.argv[5] || 'Admin';
    const lastName = process.argv[6] || 'User';

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      console.log('\nError: User with this username or email already exists!');
      console.log(`Existing user: ${existingUser.username} (${existingUser.email})`);
      console.log(`Current role: ${existingUser.role}`);

      // Ask if we should update the role
      if (existingUser.role !== 'admin') {
        console.log('\nUpdating user role to admin...');
        existingUser.role = 'admin';
        await existingUser.save();
        console.log('User role updated to admin successfully!');
      } else {
        console.log('\nUser already has admin role.');
      }

      process.exit(0);
    }

    // Create new admin user
    const admin = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role: 'admin',
      isEmailVerified: true
    });

    await admin.save();

    console.log('\n=== Admin User Created Successfully ===');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: admin`);
    console.log('\nIMPORTANT: Please change the password after first login!');
    console.log('=====================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\nError creating admin user:', error.message);
    process.exit(1);
  }
};

// Usage instructions
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('\n=== Create Admin User Script ===\n');
  console.log('Usage:');
  console.log('  node scripts/createAdmin.js [username] [email] [password] [firstName] [lastName]\n');
  console.log('Examples:');
  console.log('  node scripts/createAdmin.js');
  console.log('  node scripts/createAdmin.js admin admin@example.com SecurePass123');
  console.log('  node scripts/createAdmin.js john john@example.com Pass123 John Doe\n');
  console.log('Default values if not provided:');
  console.log('  username: admin');
  console.log('  email: admin@futelatosomba.com');
  console.log('  password: Admin@123');
  console.log('  firstName: Admin');
  console.log('  lastName: User\n');
  process.exit(0);
}

createAdminUser();
