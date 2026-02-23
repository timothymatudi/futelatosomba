// User routes for profile management (auth routes are in routes/auth.js)
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
        res.status(500).json({ error: error.message });
    }
});

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('properties');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update user profile (authenticated, own profile only)
router.put('/:id', auth, async (req, res) => {
    try {
        // Users can only update their own profile
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ error: 'Not authorized to update this profile' });
        }

        // Strip sensitive fields that users should not self-modify
        const { password, role, isEmailVerified, resetPasswordToken, emailVerificationToken, ...updateData } = req.body;

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
        res.status(400).json({ error: error.message });
    }
});

// Get user's properties
router.get('/:id/properties', async (req, res) => {
    try {
        const properties = await Property.find({ owner: req.params.id })
            .sort({ createdAt: -1 });

        res.json(properties);
    } catch (error) {
        console.error('Error fetching user properties:', error);
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
});

// Get user's favorite properties
router.get('/favorites', auth, async (req, res) => {
    try {
        const properties = await Property.find({ favorites: req.user.id });
        res.json(properties);
    } catch (error) {
        console.error('Error fetching favorite properties:', error);
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
