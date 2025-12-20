const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../services/emailService');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res, next) => {
  const {
    email,
    password,
    name, // This maps to fullName in frontend
    phone,
    role,
    agencyName,
    licenseNumber,
    agencyAddress,
    agencyLogo
  } = req.body;

  // Basic validation for required fields
  if (!email || !password || !name || !phone || !role) {
    return res.status(400).json({ msg: 'Please enter all required fields' });
  }

  // Additional validation for agent-specific fields
  if (role === 'agent') {
    if (!agencyName || !licenseNumber || !agencyAddress) {
      return res.status(400).json({ msg: 'Agency name, license number, and agency address are required for agents' });
    }
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    if (role === 'agent') {
      let agent = await User.findOne({ licenseNumber });
      if (agent) {
        return res.status(400).json({ msg: 'License number already in use' });
      }
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

    // Create new user
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const newUser = {
      email,
      password,
      firstName,
      lastName,
      username: email.split('@')[0] + Math.floor(Math.random() * 10000),
      phone,
      role,
      emailVerificationToken: verificationTokenHash,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      isEmailVerified: false
    };

    // Add agent specific fields if role is agent
    if (role === 'agent') {
      newUser.agencyName = agencyName;
      newUser.licenseNumber = licenseNumber;
      newUser.agencyAddress = agencyAddress;
      newUser.agencyLogo = agencyLogo;
    }

    user = new User(newUser);

    await user.save();

    // Send verification email
    try {
      const fullName = (user.firstName + (user.lastName ? ' ' + user.lastName : '')).trim();
      await emailService.sendVerificationEmail(
        user.email,
        fullName || user.username,
        verificationToken
      );
      console.log('Verification email sent successfully to:', user.email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue registration even if email fails
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err);
          return res.status(500).json({ msg: 'Error generating token' });
        }
        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
            isEmailVerified: user.isEmailVerified
          },
          message: 'Registration successful. Please check your email to verify your account.'
        });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    let user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err);
          return res.status(500).json({ msg: 'Error generating token' });
        }
        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
            isEmailVerified: user.isEmailVerified
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        user.fullName || user.username,
        resetToken
      );
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
    }

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const resetTokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET api/auth/verify-email/:token
// @desc    Verify email address
// @access  Public
router.get('/verify-email/:token', async (req, res) => {
  try {
    const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST api/auth/resend-verification
// @desc    Resend email verification
// @access  Public
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

    user.emailVerificationToken = verificationTokenHash;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send verification email
    try {
      const fullName = (user.firstName + (user.lastName ? ' ' + user.lastName : '')).trim();
      await emailService.sendVerificationEmail(
        user.email,
        fullName || user.username,
        verificationToken
      );
      res.json({ message: 'Verification email sent successfully' });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
