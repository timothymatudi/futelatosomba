const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
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
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
