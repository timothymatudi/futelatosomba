const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

module.exports = async function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = req.header('x-auth-token') || bearerToken;

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Support both token shapes used in this codebase:
    //   /api/auth signs { user: { id } }
    //   /api/users signs { id }
    req.user = decoded.user || { id: decoded.id };
    if (!req.user?.id) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    // Fetch the user from the database to get their role
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(401).json({ msg: 'User not found' });
    }

    // Check if the user has the 'agent' role
    if (user.role !== 'agent' && user.role !== 'admin') { // Admin can also manage properties
        return res.status(403).json({ msg: 'Access denied: Not an agent or admin' });
    }

    // Attach the full user object (including role) to the request
    req.fullUser = user; 
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
