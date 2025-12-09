// Admin panel routes - Requires admin role
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const Donation = require('../models/Donation');

// Apply admin authentication to all routes
router.use(adminAuth);

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Admin only
 */
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

    // Get total counts
    const [
      totalUsers,
      totalProperties,
      totalTransactions,
      totalDonations,
      activeProperties,
      pendingProperties,
      recentUsers,
      recentProperties
    ] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Transaction.countDocuments(),
      Donation.countDocuments(),
      Property.countDocuments({ status: 'active' }),
      Property.countDocuments({ status: 'pending' }),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Property.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);

    // Get user role distribution
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get property status distribution
    const propertiesByStatus = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate total revenue from successful transactions
    const revenueResult = await Transaction.aggregate([
      { $match: { status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Revenue in the last 30 days
    const recentRevenueResult = await Transaction.aggregate([
      {
        $match: {
          status: 'succeeded',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const recentRevenue = recentRevenueResult[0]?.total || 0;

    // Get donation statistics
    const donationStats = await Donation.aggregate([
      { $match: { status: 'succeeded' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Revenue by transaction type
    const revenueByType = await Transaction.aggregate([
      {
        $match: { status: 'succeeded' }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get property type distribution
    const propertiesByType = await Property.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get top viewed properties
    const topProperties = await Property.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title views price location.city');

    res.json({
      success: true,
      stats: {
        overview: {
          totalUsers,
          totalProperties,
          totalTransactions,
          totalDonations,
          activeProperties,
          pendingProperties,
          recentUsers,
          recentProperties
        },
        revenue: {
          total: totalRevenue / 100, // Convert from cents to dollars
          recent30Days: recentRevenue / 100,
          byType: revenueByType.map(item => ({
            type: item._id,
            total: item.total / 100,
            count: item.count
          }))
        },
        donations: {
          total: donationStats[0]?.total / 100 || 0,
          count: donationStats[0]?.count || 0
        },
        users: {
          byRole: usersByRole.map(item => ({
            role: item._id,
            count: item.count
          }))
        },
        properties: {
          byStatus: propertiesByStatus.map(item => ({
            status: item._id,
            count: item.count
          })),
          byType: propertiesByType.map(item => ({
            type: item._id,
            count: item.count
          })),
          topViewed: topProperties
        }
      }
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({
      success: false,
      msg: 'Error fetching statistics',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/admin/properties
 * @desc    Get all properties with filters
 * @access  Admin only
 */
router.get('/properties', async (req, res) => {
  try {
    const {
      status,
      propertyType,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate('owner', 'username email firstName lastName role')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Property.countDocuments(filter)
    ]);

    res.json({
      success: true,
      properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProperties: total,
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({
      success: false,
      msg: 'Error fetching properties',
      error: err.message
    });
  }
});

/**
 * @route   PUT /api/admin/properties/:id/approve
 * @desc    Approve a property listing
 * @access  Admin only
 */
router.put('/properties/:id/approve', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        msg: 'Property not found'
      });
    }

    property.status = 'active';
    await property.save();

    // Log admin action
    console.log(`Property ${property._id} approved by admin ${req.user.username}`);

    res.json({
      success: true,
      msg: 'Property approved successfully',
      property
    });
  } catch (err) {
    console.error('Error approving property:', err);
    res.status(500).json({
      success: false,
      msg: 'Error approving property',
      error: err.message
    });
  }
});

/**
 * @route   PUT /api/admin/properties/:id/reject
 * @desc    Reject a property listing
 * @access  Admin only
 */
router.put('/properties/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        msg: 'Property not found'
      });
    }

    property.status = 'inactive';
    await property.save();

    // Log admin action with reason
    console.log(`Property ${property._id} rejected by admin ${req.user.username}. Reason: ${reason || 'Not specified'}`);

    res.json({
      success: true,
      msg: 'Property rejected successfully',
      property,
      reason: reason || 'Not specified'
    });
  } catch (err) {
    console.error('Error rejecting property:', err);
    res.status(500).json({
      success: false,
      msg: 'Error rejecting property',
      error: err.message
    });
  }
});

/**
 * @route   DELETE /api/admin/properties/:id
 * @desc    Delete a property (admin only)
 * @access  Admin only
 */
router.delete('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        msg: 'Property not found'
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    // Log admin action
    console.log(`Property ${property._id} (${property.title}) deleted by admin ${req.user.username}`);

    res.json({
      success: true,
      msg: 'Property deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({
      success: false,
      msg: 'Error deleting property',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filters
 * @access  Admin only
 */
router.get('/users', async (req, res) => {
  try {
    const {
      role,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -resetPasswordToken -emailVerificationToken')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter)
    ]);

    // Get property counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const propertyCount = await Property.countDocuments({ owner: user._id });
        return {
          ...user,
          propertyCount
        };
      })
    );

    res.json({
      success: true,
      users: usersWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total,
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      success: false,
      msg: 'Error fetching users',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get detailed user information
 * @access  Admin only
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -emailVerificationToken')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found'
      });
    }

    // Get user's properties
    const properties = await Property.find({ owner: user._id })
      .select('title status price createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's transactions
    const transactions = await Transaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      user: {
        ...user,
        properties,
        transactions,
        propertyCount: properties.length
      }
    });
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({
      success: false,
      msg: 'Error fetching user details',
      error: err.message
    });
  }
});

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Admin only
 */
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    if (!['user', 'admin', 'agent'].includes(role)) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid role. Must be: user, admin, or agent'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found'
      });
    }

    // Prevent removing admin role from self
    if (user._id.toString() === req.user.id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        msg: 'You cannot remove your own admin privileges'
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Log admin action
    console.log(`User ${user.username} role changed from ${oldRole} to ${role} by admin ${req.user.username}`);

    res.json({
      success: true,
      msg: `User role updated to ${role}`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({
      success: false,
      msg: 'Error updating user role',
      error: err.message
    });
  }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete/ban a user
 * @access  Admin only
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found'
      });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        msg: 'You cannot delete your own account'
      });
    }

    // Delete user's properties
    const propertiesDeleted = await Property.deleteMany({ owner: user._id });

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    // Log admin action
    console.log(`User ${user.username} (${user.email}) deleted by admin ${req.user.username}. Properties deleted: ${propertiesDeleted.deletedCount}`);

    res.json({
      success: true,
      msg: 'User deleted successfully',
      details: {
        username: user.username,
        email: user.email,
        propertiesDeleted: propertiesDeleted.deletedCount
      }
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({
      success: false,
      msg: 'Error deleting user',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/admin/transactions
 * @desc    Get all transactions with filters
 * @access  Admin only
 */
router.get('/transactions', async (req, res) => {
  try {
    const {
      status,
      type,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate
    } = req.query;

    // Build filter query
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('user', 'username email')
        .populate('property', 'title location.address')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Transaction.countDocuments(filter)
    ]);

    // Calculate total revenue
    const revenueResult = await Transaction.aggregate([
      { $match: { ...filter, status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      success: true,
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalTransactions: total,
        limit: parseInt(limit)
      },
      summary: {
        totalRevenue: totalRevenue / 100 // Convert from cents to dollars
      }
    });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({
      success: false,
      msg: 'Error fetching transactions',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/admin/donations
 * @desc    Get all donations with filters
 * @access  Admin only
 */
router.get('/donations', async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate
    } = req.query;

    // Build filter query
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .populate('donor.userId', 'username email')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Donation.countDocuments(filter)
    ]);

    // Calculate total donations
    const donationResult = await Donation.aggregate([
      { $match: { ...filter, status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalDonations = donationResult[0]?.total || 0;

    res.json({
      success: true,
      donations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalDonations: total,
        limit: parseInt(limit)
      },
      summary: {
        totalAmount: totalDonations / 100 // Convert from cents to dollars
      }
    });
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({
      success: false,
      msg: 'Error fetching donations',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/admin/activity-log
 * @desc    Get recent admin activity log
 * @access  Admin only
 */
router.get('/activity-log', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    // Get recent property status changes
    const recentProperties = await Property.find()
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .select('title status updatedAt owner')
      .populate('owner', 'username')
      .lean();

    // Get recent user role changes
    const recentUsers = await User.find()
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .select('username role updatedAt')
      .lean();

    // Combine and sort by date
    const activities = [
      ...recentProperties.map(p => ({
        type: 'property',
        action: 'status_change',
        item: p.title,
        status: p.status,
        timestamp: p.updatedAt
      })),
      ...recentUsers.map(u => ({
        type: 'user',
        action: 'role_change',
        item: u.username,
        role: u.role,
        timestamp: u.updatedAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      activities
    });
  } catch (err) {
    console.error('Error fetching activity log:', err);
    res.status(500).json({
      success: false,
      msg: 'Error fetching activity log',
      error: err.message
    });
  }
});

/**
 * @route   POST /api/admin/broadcast
 * @desc    Send broadcast notification to users (placeholder for future implementation)
 * @access  Admin only
 */
router.post('/broadcast', async (req, res) => {
  try {
    const { message, targetRole } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        msg: 'Message is required'
      });
    }

    // Build filter for target users
    const filter = {};
    if (targetRole && targetRole !== 'all') {
      filter.role = targetRole;
    }

    const users = await User.find(filter).select('email username');

    // Log broadcast
    console.log(`Broadcast message sent by admin ${req.user.username} to ${users.length} users (${targetRole || 'all'}): ${message}`);

    // TODO: Implement actual email/notification sending
    // For now, just return success

    res.json({
      success: true,
      msg: 'Broadcast sent successfully',
      recipientCount: users.length
    });
  } catch (err) {
    console.error('Error sending broadcast:', err);
    res.status(500).json({
      success: false,
      msg: 'Error sending broadcast',
      error: err.message
    });
  }
});

module.exports = router;
