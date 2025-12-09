// User routes for authentication and user management
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            firstName,
            lastName,
            phone,
            role, // Added for agent registration
            agencyName,
            licenseNumber,
            agencyAddress,
            agencyLogo
        } = req.body;

        // Basic validation for agent fields if role is agent
        if (role === 'agent') {
            if (!agencyName || !licenseNumber || !agencyAddress) {
                return res.status(400).json({ error: 'Agent-specific fields (agencyName, licenseNumber, agencyAddress) are required for agent registration' });
            }
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: existingUser.email === email
                    ? 'Email already registered'
                    : 'Username already taken'
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            phone,
            role: role || 'user', // Default to 'user' if not specified
            // Conditionally add agent-specific fields
            ...(role === 'agent' && {
                agencyName,
                licenseNumber,
                agencyAddress,
                agencyLogo
            })
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                agencyName: user.agencyName, // Include agent fields in response
                licenseNumber: user.licenseNumber,
                agencyAddress: user.agencyAddress,
                agencyLogo: user.agencyLogo
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({ error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user (include password field)
        const user = await User.findOne({
            $or: [{ username }, { email: username }]
        }).select('+password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isPremium: user.isPremium,
                agencyName: user.agencyName, // Include agent fields in response
                licenseNumber: user.licenseNumber,
                agencyAddress: user.agencyAddress,
                agencyLogo: user.agencyLogo
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: error.message });
    }
});

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

// Update user profile
router.put('/:id', async (req, res) => {
    try {
        const { password, ...updateData } = req.body;

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
