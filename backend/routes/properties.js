// Property routes for CRUD operations
const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// Get all properties with filters
router.get('/', async (req, res) => {
    try {
        const {
            listingType,
            propertyType,
            city,
            minPrice,
            maxPrice,
            bedrooms,
            status = 'active',
            page = 1,
            limit = 12
        } = req.query;

        // Build query
        const query = { status };

        if (listingType) query.listingType = listingType;
        if (propertyType && propertyType !== 'any') query.propertyType = propertyType;
        if (city) query['location.city'] = new RegExp(city, 'i');

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (bedrooms && bedrooms !== 'any') {
            if (bedrooms === '4+') {
                query.bedrooms = { $gte: 4 };
            } else {
                query.bedrooms = Number(bedrooms);
            }
        }

        // Execute query with pagination
        const properties = await Property.find(query)
            .populate('owner', 'username email firstName lastName')
            .sort({ createdAt: -1, isPremium: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Property.countDocuments(query);

        res.json({
            properties,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single property by ID
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('owner', 'username email firstName lastName phone avatar');

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Increment views
        await property.incrementViews();

        res.json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create new property
router.post('/', async (req, res) => {
    try {
        const property = new Property(req.body);
        await property.save();

        res.status(201).json({
            message: 'Property created successfully',
            property
        });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(400).json({ error: error.message });
    }
});

// Update property
router.put('/:id', async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.json({
            message: 'Property updated successfully',
            property
        });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete property
router.delete('/:id', async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: error.message });
    }
});

// Make property premium
router.post('/:id/premium', async (req, res) => {
    try {
        const { duration = 30 } = req.body; // days

        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        property.isPremium = true;
        property.premiumExpiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
        await property.save();

        res.json({
            message: 'Property upgraded to premium',
            property
        });
    } catch (error) {
        console.error('Error upgrading property:', error);
        res.status(500).json({ error: error.message });
    }
});

// Search properties by location
router.get('/search/location', async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({ error: 'City parameter is required' });
        }

        const properties = await Property.findByLocation(city);
        res.json(properties);
    } catch (error) {
        console.error('Error searching properties:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
