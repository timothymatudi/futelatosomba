const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function optionalAuth(req, res, next) {
    const authHeader = req.header('Authorization') || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = req.header('x-auth-token') || bearerToken;

    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user?.id || decoded.id;
        if (!userId) return next();

        const user = await User.findById(userId);
        if (user) {
            req.user = { id: user._id.toString() };
            req.fullUser = user;
        }
    } catch (error) {
        // This route remains public; an invalid/expired token simply receives
        // anonymous visibility rather than access to private listing states.
    }

    next();
};
