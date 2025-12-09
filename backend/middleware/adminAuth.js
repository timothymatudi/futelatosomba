// Admin authentication middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify admin role
 * Ensures only users with role='admin' can access protected routes
 */
module.exports = async function(req, res, next) {
  try {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
      return res.status(401).json({
        success: false,
        msg: 'No token provided, authorization denied'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        msg: 'Token is not valid'
      });
    }

    // Get user from database to verify current role
    const user = await User.findById(decoded.user.id).select('role username email');

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: 'User not found'
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      // Log unauthorized access attempt
      console.warn(`Unauthorized admin access attempt by user: ${user.username} (${user.email})`);

      return res.status(403).json({
        success: false,
        msg: 'Access denied. Admin privileges required.'
      });
    }

    // Attach user info to request
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    // Log admin action
    console.log(`Admin action: ${req.method} ${req.originalUrl} by ${user.username}`);

    next();
  } catch (err) {
    console.error('Admin auth middleware error:', err);
    res.status(500).json({
      success: false,
      msg: 'Server error during authentication'
    });
  }
};
