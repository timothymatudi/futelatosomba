const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  agencyName: {
    type: String,
    required: function() { return this.role === 'agent'; } // Required only if role is 'agent'
  },
  licenseNumber: {
    type: String,
    required: function() { return this.role === 'agent'; },
    unique: true, // License numbers should be unique
    sparse: true // Allows null values, so uniqueness only applies to non-null values
  },
  agencyAddress: {
    type: String,
    required: function() { return this.role === 'agent'; }
  },
  agencyLogo: { // URL to the agency logo
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'agent'],
    default: 'user'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  savedSearches: [{
    name: String,
    query: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
  }],
  propertyAlerts: [{ // Added Property Alerts
    name: { type: String, required: true },
    query: { type: mongoose.Schema.Types.Mixed, required: true }, // Store search criteria
    frequency: {
      type: String,
      enum: ['instant', 'daily', 'weekly'],
      default: 'daily'
    },
    lastNotifiedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
  }],
  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  // Email verification fields
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
