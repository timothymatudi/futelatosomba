// User routes for authentication and user management
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Property = require('../models/Property');

// Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Save a search
router.post('/searches', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name, query } = req.body;
        user.savedSearches.push({ name, query });
        await user.save();

        res.json(user.savedSearches);
    } catch (error) {
        console.error('Error saving search:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get saved searches
router.get('/searches', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.savedSearches);
    } catch (error) {
        console.error('Error getting saved searches:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a saved search
router.delete('/searches/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.savedSearches = user.savedSearches.filter(
            (search) => search._id.toString() !== req.params.id
        );
        await user.save();

        res.json(user.savedSearches);
    } catch (error) {
        console.error('Error deleting saved search:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's favorite properties
router.get('/favorites', auth, async (req, res) => {
    try {
        const properties = await Property.find({ favorites: req.user.id });
        res.json(properties);
    } catch (error) {
        console.error('Error fetching favorite properties:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a property alert
router.post('/alerts', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name, query, frequency } = req.body;
        if (!name || !query) {
            return res.status(400).json({ error: 'Alert name and query are required' });
        }

        user.propertyAlerts.push({ name, query, frequency });
        await user.save();

        res.status(201).json(user.propertyAlerts);
    } catch (error) {
        console.error('Error creating property alert:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all property alerts
router.get('/alerts', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.propertyAlerts);
    } catch (error) {
        console.error('Error getting property alerts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a property alert
router.delete('/alerts/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.propertyAlerts = user.propertyAlerts.filter(
            (alert) => alert._id.toString() !== req.params.id
        );
        await user.save();

        res.json(user.propertyAlerts);
    } catch (error) {
        console.error('Error deleting property alert:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's properties (authenticated — consistent with the other /:id routes)
router.get('/:id/properties', auth, async (req, res) => {
    try {
        const properties = await Property.find({ owner: req.params.id })
            .sort({ createdAt: -1 });

        res.json(properties);
    } catch (error) {
        console.error('Error fetching user properties:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user profile (authenticated + owner-or-admin). This returns the full user
// record incl. email and agent details, so a caller may only read their own
// record — an admin can read anyone's.
router.get('/:id', auth, async (req, res) => {
    try {
        const requester = await User.findById(req.user.id).select('role');
        const isAdmin = requester?.role === 'admin';
        if (req.user.id !== req.params.id && !isAdmin) {
            return res.status(403).json({ error: 'You can only view your own profile' });
        }

        const user = await User.findById(req.params.id)
            .populate('properties');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile (authenticated + owner-only). Without this a caller could
// overwrite ANY user's profile by id. Users may only edit their own record, and
// privilege fields are stripped so a self-update can't escalate to agent/admin.
router.put('/:id', auth, async (req, res) => {
    try {
        // Owner can edit their own profile; an admin can edit anyone's.
        const requester = await User.findById(req.user.id).select('role');
        const isAdmin = requester?.role === 'admin';
        if (req.user.id !== req.params.id && !isAdmin) {
            return res.status(403).json({ error: 'You can only update your own profile' });
        }

        // Never allow these to be set via a profile update (applies to admins too).
        // Note: the model's field is isEmailVerified (not isVerified); the token
        // fields must also be stripped or a user could forge verification/reset state.
        const {
            password, role, isPremium, isVerified, isEmailVerified,
            emailVerificationToken, emailVerificationExpires,
            resetPasswordToken, resetPasswordExpires,
            _id, ...updateData
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ error: 'Server error' });
    }
});

module.exports = router;
