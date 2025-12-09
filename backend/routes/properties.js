// Property routes for CRUD operations with full search, filters, and pagination
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const agentAuth = require('../middleware/agentAuth');
const Property = require('../models/Property');
const User = require('../models/User');
const fs = require('fs');
const { upload, uploadPropertyImages } = require('../middleware/upload');
const emailService = require('../services/emailService');



// Get properties within a radius (nearby search)
router.get('/nearby', async (req, res) => {
    try {
        const {
            lat,
            lng,
            radius = 10, // Default radius in kilometers
            listingType,
            propertyType,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms,
            minArea,
            maxArea,
            features,
            amenities,
            status = 'active',
            isPremium,
            sortBy = 'distance',
            page = 1,
            limit = 12
        } = req.query;

        // Validate required parameters
        if (!lat || !lng) {
            return res.status(400).json({
                error: 'Latitude and longitude are required',
                message: 'Please provide both lat and lng parameters'
            });
        }

        // Validate coordinate ranges
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            return res.status(400).json({
                error: 'Invalid latitude',
                message: 'Latitude must be a number between -90 and 90'
            });
        }

        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            return res.status(400).json({
                error: 'Invalid longitude',
                message: 'Longitude must be a number between -180 and 180'
            });
        }

        // Validate and convert radius
        const radiusKm = parseFloat(radius);
        if (isNaN(radiusKm) || radiusKm <= 0) {
            return res.status(400).json({
                error: 'Invalid radius',
                message: 'Radius must be a positive number'
            });
        }

        // Convert radius from kilometers to meters for MongoDB
        const radiusMeters = radiusKm * 1000;

        // Build match query for additional filters
        const matchQuery = {};

        if (listingType) matchQuery.listingType = listingType;
        if (propertyType && propertyType !== 'any') matchQuery.propertyType = propertyType;
        if (minPrice) matchQuery.price = { ...matchQuery.price, $gte: Number(minPrice) };
        if (maxPrice) matchQuery.price = { ...matchQuery.price, $lte: Number(maxPrice) };
        if (bedrooms) {
            if (bedrooms === '4+') {
                matchQuery.bedrooms = { $gte: 4 };
            } else if (bedrooms !== 'any') {
                matchQuery.bedrooms = { $gte: Number(bedrooms) };
            }
        }
        if (bathrooms) matchQuery.bathrooms = { $gte: Number(bathrooms) };
        if (minArea) matchQuery.area = { ...matchQuery.area, $gte: Number(minArea) };
        if (maxArea) matchQuery.area = { ...matchQuery.area, $lte: Number(maxArea) };
        if (features) {
            matchQuery.features = { $all: Array.isArray(features) ? features : features.split(',') };
        }
        if (amenities) {
            matchQuery.amenities = { $all: Array.isArray(amenities) ? amenities : amenities.split(',') };
        }
        if (status) {
            matchQuery.status = status;
        }
        if (isPremium !== undefined) {
            matchQuery.isPremium = isPremium === 'true';
        }

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(50, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        // Build aggregation pipeline
        const pipeline = [
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [longitude, latitude] // GeoJSON uses [lng, lat]
                    },
                    distanceField: 'distance',
                    maxDistance: radiusMeters,
                    spherical: true,
                    key: 'location.geoLocation'
                }
            }
        ];

        // Add match stage if there are filters
        if (Object.keys(matchQuery).length > 0) {
            pipeline.push({ $match: matchQuery });
        }

        // Add sorting (distance is default, already sorted by $geoNear)
        if (sortBy && sortBy !== 'distance') {
            const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
            pipeline.push({ $sort: { [sortBy]: sortOrder } });
        }

        // Count total documents
        const countPipeline = [...pipeline, { $count: 'total' }];
        const countResult = await Property.aggregate(countPipeline);
        const totalItems = countResult[0]?.total || 0;

        // Add pagination
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limitNum });

        // Populate owner information
        pipeline.push({
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
            }
        });
        pipeline.push({ $unwind: '$owner' });
        pipeline.push({
            $project: {
                'owner.password': 0,
                'owner.refreshToken': 0
            }
        });

        // Convert distance from meters to kilometers
        pipeline.push({
            $addFields: {
                distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 2] }
            }
        });

        const properties = await Property.aggregate(pipeline);

        const totalPages = Math.ceil(totalItems / limitNum);

        res.json({
            properties,
            searchCenter: {
                lat: latitude,
                lng: longitude
            },
            radiusKm,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems,
                itemsPerPage: limitNum,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });

    } catch (error) {
        console.error('Error in nearby search:', error);
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});

// Get properties within map bounds (bounding box search)
router.get('/bounds', async (req, res) => {
    try {
        const {
            neLat,
            neLng,
            swLat,
            swLng,
            listingType,
            propertyType,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms,
            minArea,
            maxArea,
            features,
            amenities,
            status = 'active',
            isPremium,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 50
        } = req.query;

        // Validate required parameters
        if (!neLat || !neLng || !swLat || !swLng) {
            return res.status(400).json({
                error: 'Bounding box coordinates required',
                message: 'Please provide neLat, neLng, swLat, and swLng parameters'
            });
        }

        // Parse and validate coordinates
        const northEastLat = parseFloat(neLat);
        const northEastLng = parseFloat(neLng);
        const southWestLat = parseFloat(swLat);
        const southWestLng = parseFloat(swLng);

        // Validate coordinate ranges
        if (isNaN(northEastLat) || northEastLat < -90 || northEastLat > 90 ||
            isNaN(southWestLat) || southWestLat < -90 || southWestLat > 90) {
            return res.status(400).json({
                error: 'Invalid latitude',
                message: 'Latitude values must be between -90 and 90'
            });
        }

        if (isNaN(northEastLng) || northEastLng < -180 || northEastLng > 180 ||
            isNaN(southWestLng) || southWestLng < -180 || southWestLng > 180) {
            return res.status(400).json({
                error: 'Invalid longitude',
                message: 'Longitude values must be between -180 and 180'
            });
        }

        // Validate bounding box logic
        if (northEastLat <= southWestLat) {
            return res.status(400).json({
                error: 'Invalid bounding box',
                message: 'North-East latitude must be greater than South-West latitude'
            });
        }

        // Build query
        const query = {
            'location.geoLocation': {
                $geoWithin: {
                    $box: [
                        [southWestLng, southWestLat], // Bottom-left corner [lng, lat]
                        [northEastLng, northEastLat]  // Top-right corner [lng, lat]
                    ]
                }
            }
        };

        // Add additional filters
        if (listingType) query.listingType = listingType;
        if (propertyType && propertyType !== 'any') query.propertyType = propertyType;
        if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
        if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
        if (bedrooms) {
            if (bedrooms === '4+') {
                query.bedrooms = { $gte: 4 };
            } else if (bedrooms !== 'any') {
                query.bedrooms = { $gte: Number(bedrooms) };
            }
        }
        if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
        if (minArea) query.area = { ...query.area, $gte: Number(minArea) };
        if (maxArea) query.area = { ...query.area, $lte: Number(maxArea) };
        if (features) {
            query.features = { $all: Array.isArray(features) ? features : features.split(',') };
        }
        if (amenities) {
            query.amenities = { $all: Array.isArray(amenities) ? amenities : amenities.split(',') };
        }
        if (status) {
            query.status = status;
        }
        if (isPremium !== undefined) {
            query.isPremium = isPremium === 'true';
        }

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(100, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        const sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }

        const properties = await Property.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .populate('owner', 'username email firstName lastName phone agencyName licenseNumber agencyAddress agencyLogo');

        const totalItems = await Property.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limitNum);

        res.json({
            properties,
            bounds: {
                northEast: { lat: northEastLat, lng: northEastLng },
                southWest: { lat: southWestLat, lng: southWestLng }
            },
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems,
                itemsPerPage: limitNum,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });

    } catch (error) {
        console.error('Error in bounds search:', error);
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});

// Get all properties with advanced filters, sorting, and pagination
router.get('/', async (req, res) => {
    try {
        const {
            listingType,
            propertyType,
            city,
            location,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms,
            minArea,
            maxArea,
            search,
            features, // Added
            amenities, // Added
            minYearBuilt, // Added
            maxYearBuilt, // Added
            status, // Added
            isPremium, // Added
            owner, // Added
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 12,
            // Location-based sorting parameters
            sortByDistance,
            lat,
            lng
        } = req.query;

        // Check if location-based sorting is requested
        const useLocationSort = sortByDistance === 'true' && lat && lng;

        // If location-based sorting is requested, validate coordinates
        if (useLocationSort) {
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);

            if (isNaN(latitude) || latitude < -90 || latitude > 90) {
                return res.status(400).json({
                    error: 'Invalid latitude',
                    message: 'Latitude must be a number between -90 and 90'
                });
            }

            if (isNaN(longitude) || longitude < -180 || longitude > 180) {
                return res.status(400).json({
                    error: 'Invalid longitude',
                    message: 'Longitude must be a number between -180 and 180'
                });
            }

            // Use aggregation pipeline for location-based sorting
            const matchQuery = {};

            if (listingType) matchQuery.listingType = listingType;
            if (propertyType && propertyType !== 'any') matchQuery.propertyType = propertyType;
            if (city) matchQuery['location.city'] = new RegExp(city, 'i');
            if (location) matchQuery['location.address'] = new RegExp(location, 'i');
            if (minPrice) matchQuery.price = { ...matchQuery.price, $gte: Number(minPrice) };
            if (maxPrice) matchQuery.price = { ...matchQuery.price, $lte: Number(maxPrice) };
            if (bedrooms) {
                if (bedrooms === '4+') {
                    matchQuery.bedrooms = { $gte: 4 };
                } else if (bedrooms !== 'any') {
                    matchQuery.bedrooms = { $gte: Number(bedrooms) };
                }
            }
            if (bathrooms) matchQuery.bathrooms = { $gte: Number(bathrooms) };
            if (minArea) matchQuery.area = { ...matchQuery.area, $gte: Number(minArea) };
            if (maxArea) matchQuery.area = { ...matchQuery.area, $lte: Number(maxArea) };
            if (search) {
                const searchRegExp = new RegExp(search, 'i');
                matchQuery.$or = [
                    { title: searchRegExp },
                    { description: searchRegExp },
                    { 'location.address': searchRegExp },
                    { 'location.city': searchRegExp },
                ];
            }
            if (features) {
                matchQuery.features = { $all: Array.isArray(features) ? features : features.split(',') };
            }
            if (amenities) {
                matchQuery.amenities = { $all: Array.isArray(amenities) ? amenities : amenities.split(',') };
            }
            if (minYearBuilt) {
                matchQuery.yearBuilt = { ...matchQuery.yearBuilt, $gte: Number(minYearBuilt) };
            }
            if (maxYearBuilt) {
                matchQuery.yearBuilt = { ...matchQuery.yearBuilt, $lte: Number(maxYearBuilt) };
            }
            if (status) {
                matchQuery.status = status;
            }
            if (isPremium !== undefined) {
                matchQuery.isPremium = isPremium === 'true';
            }
            if (owner) {
                matchQuery.owner = owner;
            }

            const pageNum = Math.max(1, Number(page));
            const limitNum = Math.min(50, Math.max(1, Number(limit)));
            const skip = (pageNum - 1) * limitNum;

            // Build aggregation pipeline with $geoNear
            const pipeline = [
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        },
                        distanceField: 'distance',
                        spherical: true,
                        key: 'location.geoLocation'
                    }
                }
            ];

            // Add match stage if there are filters
            if (Object.keys(matchQuery).length > 0) {
                pipeline.push({ $match: matchQuery });
            }

            // Count total documents
            const countPipeline = [...pipeline, { $count: 'total' }];
            const countResult = await Property.aggregate(countPipeline);
            const totalItems = countResult[0]?.total || 0;

            // Add pagination
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limitNum });

            // Populate owner information
            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            });
            pipeline.push({ $unwind: '$owner' });
            pipeline.push({
                $project: {
                    'owner.password': 0,
                    'owner.refreshToken': 0
                }
            });

            // Convert distance from meters to kilometers
            pipeline.push({
                $addFields: {
                    distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 2] }
                }
            });

            const properties = await Property.aggregate(pipeline);
            const totalPages = Math.ceil(totalItems / limitNum);

            return res.json({
                properties,
                sortedByDistance: true,
                referencePoint: {
                    lat: latitude,
                    lng: longitude
                },
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalItems,
                    itemsPerPage: limitNum,
                    hasNext: pageNum < totalPages,
                    hasPrev: pageNum > 1
                }
            });
        }

        // Standard query without location-based sorting
        const query = {};

        if (listingType) query.listingType = listingType;
        if (propertyType && propertyType !== 'any') query.propertyType = propertyType;
        if (city) query['location.city'] = new RegExp(city, 'i');
        if (location) query['location.address'] = new RegExp(location, 'i');
        if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
        if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
        if (bedrooms) {
            if (bedrooms === '4+') {
                query.bedrooms = { $gte: 4 };
            } else if (bedrooms !== 'any') {
                query.bedrooms = { $gte: Number(bedrooms) };
            }
        }
        if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
        if (minArea) query.area = { ...query.area, $gte: Number(minArea) };
        if (maxArea) query.area = { ...query.area, $lte: Number(maxArea) };

        if (search) {
            const searchRegExp = new RegExp(search, 'i');
            query.$or = [
                { title: searchRegExp },
                { description: searchRegExp },
                { 'location.address': searchRegExp },
                { 'location.city': searchRegExp },
            ];
        }
        if (features) {
            // $all matches if all elements in the array exist
            query.features = { $all: Array.isArray(features) ? features : features.split(',') };
        }
        if (amenities) {
            // $all matches if all elements in the array exist
            query.amenities = { $all: Array.isArray(amenities) ? amenities : amenities.split(',') };
        }
        if (minYearBuilt) {
            query.yearBuilt = { ...query.yearBuilt, $gte: Number(minYearBuilt) };
        }
        if (maxYearBuilt) {
            query.yearBuilt = { ...query.yearBuilt, $lte: Number(maxYearBuilt) };
        }
        if (status) {
            query.status = status;
        }
        if (isPremium !== undefined) { // Check for undefined, as false is a valid filter
            query.isPremium = isPremium === 'true'; // Convert string to boolean
        }
        if (owner) {
            query.owner = owner;
        }


        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(50, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        const sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }

        const properties = await Property.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .populate('owner', 'username email firstName lastName phone agencyName licenseNumber agencyAddress agencyLogo');

        const totalItems = await Property.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limitNum);

        res.json({
            properties,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems,
                itemsPerPage: limitNum,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
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
            .populate('owner', 'username email firstName lastName phone agencyName licenseNumber agencyAddress agencyLogo');
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Increment views
        property.views = (property.views || 0) + 1;
        await property.save();

        res.json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create new property (with image upload)
router.post('/', agentAuth,
    upload.array('images', 20),
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('propertyType').notEmpty().withMessage('Property type is required'),
        body('listingType').isIn(['sale', 'rent']).withMessage('Invalid listing type'),
        body('location.address').notEmpty().withMessage('Address is required'),
        body('location.city').notEmpty().withMessage('City is required'),
        body('location.coordinates.lat').isNumeric().withMessage('Latitude is required and must be a number'),
        body('location.coordinates.lng').isNumeric().withMessage('Longitude is required and must be a number')
    ],
    uploadPropertyImages,
    async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // If validation fails, and images were processed, clean them up
                if (req.processedImages && req.processedImages.length > 0) {
                    req.processedImages.forEach(img => {
                        fs.unlink(img.path, (err) => {
                            if (err) console.error('Error deleting uploaded image:', err);
                        });
                    });
                }
                return res.status(400).json({ errors: errors.array() });
            }

            const {
                title,
                description,
                price,
                currency,
                listingType,
                propertyType,
                bedrooms,
                bathrooms,
                area,
                areaUnit,
                location: { address, city, province, country, coordinates, zipCode },
                features,
                amenities,
                yearBuilt,
                availableFrom,
                isPremium // Allow agent to mark as premium
            } = req.body;

            const ownerId = req.fullUser._id; // Get owner from agentAuth middleware

            const newProperty = new Property({
                title,
                description,
                price: Number(price),
                currency,
                listingType,
                propertyType,
                bedrooms: Number(bedrooms) || 0,
                bathrooms: Number(bathrooms) || 0,
                area: Number(area),
                areaUnit,
                location: {
                    address,
                    city,
                    province,
                    country,
                    coordinates: {
                        lat: Number(coordinates.lat),
                        lng: Number(coordinates.lng)
                    },
                    zipCode
                },
                images: req.processedImages ? req.processedImages.map(img => ({ url: img.image, isPrimary: img.isPrimary })) : [],
                features: Array.isArray(features) ? features : (features ? features.split(',') : []),
                amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',') : []),
                owner: ownerId,
                yearBuilt: Number(yearBuilt),
                availableFrom,
                isPremium: isPremium || false, // Default to false
                status: 'pending' // Initial status for review
            });

            await newProperty.save();

            // Add property to agent's properties array
            req.fullUser.properties.push(newProperty._id);
            await req.fullUser.save();

            res.status(201).json({
                message: 'Property created successfully',
                property: newProperty
            });
        } catch (error) {
            console.error('Error creating property:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Update property
router.put('/:id', agentAuth,
    upload.array('images', 20), // Allow image updates
    [
        body('title').optional().trim().notEmpty(),
        body('price').optional().isNumeric(),
        body('propertyType').optional().notEmpty(),
        body('listingType').optional().isIn(['sale', 'rent']),
        body('location.address').optional().notEmpty(),
        body('location.city').optional().notEmpty(),
        body('location.coordinates.lat').optional().isNumeric(),
        body('location.coordinates.lng').optional().isNumeric(),
    ],
    uploadPropertyImages,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                 // If validation fails, and new images were processed, clean them up
                 if (req.processedImages && req.processedImages.length > 0) {
                    req.processedImages.forEach(img => {
                        fs.unlink(img.path, (err) => {
                            if (err) console.error('Error deleting temporary uploaded image:', err);
                        });
                    });
                }
                return res.status(400).json({ errors: errors.array() });
            }

            let property = await Property.findById(req.params.id);

            if (!property) {
                return res.status(404).json({ error: 'Property not found' });
            }

            // Authorization check: Only owner (agent) can update their property
            if (property.owner.toString() !== req.fullUser._id.toString()) {
                return res.status(403).json({ error: 'Not authorized to update this property' });
            }

            // Prepare update data
            const {
                title,
                description,
                price,
                currency,
                listingType,
                propertyType,
                bedrooms,
                bathrooms,
                area,
                areaUnit,
                location, // location object
                features,
                amenities,
                yearBuilt,
                availableFrom,
                isPremium,
                status // Allow owner to change status
            } = req.body;

            const updateData = {
                title,
                description,
                price: Number(price),
                currency,
                listingType,
                propertyType,
                bedrooms: Number(bedrooms),
                bathrooms: Number(bathrooms),
                area: Number(area),
                areaUnit,
                location,
                features: Array.isArray(features) ? features : (features ? features.split(',') : []),
                amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',') : []),
                yearBuilt: Number(yearBuilt),
                availableFrom,
                isPremium,
                status,
                updatedAt: Date.now() // Manually update updatedAt
            };

            // Filter out undefined values
            Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

            // Handle image updates
            if (req.processedImages && req.processedImages.length > 0) {
                const newImages = req.processedImages.map(img => ({ url: img.image, isPrimary: img.isPrimary }));
                // Decide how to handle existing images. For now, we'll append.
                // A more robust solution would allow deleting old images or replacing them.
                updateData.images = [...property.images, ...newImages];
            }


            property = await Property.findByIdAndUpdate(
                req.params.id,
                { $set: updateData }, // Use $set to update specific fields
                { new: true, runValidators: true }
            );


            res.json({
                message: 'Property updated successfully',
                property
            });
        } catch (error) {
            console.error('Error updating property:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Delete property
router.delete('/:id', agentAuth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Authorization check: Only owner (agent) can delete their property
        if (property.owner.toString() !== req.fullUser._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this property' });
        }

        // Delete property from MongoDB
        await Property.findByIdAndDelete(req.params.id);

        // Remove property from agent's properties array
        req.fullUser.properties.pull(req.params.id); // Use .pull() to remove from array
        await req.fullUser.save();


        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get property statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const stats = await Property.aggregate([
            {
                $group: {
                    _id: null, // Group all documents
                    totalProperties: { $sum: 1 },
                    forSale: {
                        $sum: { $cond: [{ $eq: ['$listingType', 'sale'] }, 1, 0] }
                    },
                    forRent: {
                        $sum: { $cond: [{ $eq: ['$listingType', 'rent'] }, 1, 0] }
                    },
                    premium: {
                        $sum: { $cond: [{ $eq: ['$isPremium', true] }, 1, 0] }
                    },
                    avgPriceSale: {
                        $avg: { $cond: [{ $eq: ['$listingType', 'sale'] }, '$price', null] }
                    },
                    avgPriceRent: {
                        $avg: { $cond: [{ $eq: ['$listingType', 'rent'] }, '$price', null] }
                    },
                    cities: { $addToSet: '$location.city' }, // Get unique cities
                    propertyTypes: { $addToSet: '$propertyType' } // Get unique property types
                }
            },
            {
                $project: {
                    _id: 0,
                    totalProperties: 1,
                    forSale: 1,
                    forRent: 1,
                    premium: 1,
                    avgPrice: {
                        sale: { $round: ['$avgPriceSale'] },
                        rent: { $round: ['$avgPriceRent'] }
                    },
                    cities: 1,
                    propertyTypes: 1
                }
            }
        ]);

        res.json(stats[0] || {}); // Return the first (and only) result, or empty object if no properties
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get average price per property type in a city
router.get('/stats/average-price-by-type', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ error: 'City query parameter is required.' });
        }

        const stats = await Property.aggregate([
            { $match: { 'location.city': new RegExp(city, 'i'), listingType: 'sale' } }, // Only consider 'sale' properties for average price
            {
                $group: {
                    _id: '$propertyType',
                    averagePrice: { $avg: '$price' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    propertyType: '$_id',
                    averagePrice: { $round: ['$averagePrice'] },
                    count: 1
                }
            }
        ]);

        res.json(stats);
    } catch (error) {
        console.error('Error fetching average price by property type:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get average price per bedroom count in a specific city
router.get('/stats/average-price-by-bedrooms', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ error: 'City query parameter is required.' });
        }

        const stats = await Property.aggregate([
            { $match: { 'location.city': new RegExp(city, 'i'), bedrooms: { $gte: 0 }, listingType: 'sale' } },
            {
                $group: {
                    _id: '$bedrooms',
                    averagePrice: { $avg: '$price' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    bedrooms: '$_id',
                    averagePrice: { $round: ['$averagePrice'] },
                    count: 1
                }
            }
        ]);

        res.json(stats);
    } catch (error) {
        console.error('Error fetching average price by bedrooms:', error);
        res.status(500).json({ error: error.message });
    }
});

// Favorite a property
router.post('/:id/favorite', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Add user to favorites if not already there
        if (!property.favorites.includes(req.user.id)) {
            property.favorites.push(req.user.id);
            await property.save();
        }

        res.json(property.favorites);
    } catch (error) {
        console.error('Error favoriting property:', error);
        res.status(500).json({ error: error.message });
    }
});

// Unfavorite a property
router.delete('/:id/favorite', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Remove user from favorites
        property.favorites = property.favorites.filter(
            (userId) => userId.toString() !== req.user.id
        );
        await property.save();

        res.json(property.favorites);
    } catch (error) {
        console.error('Error unfavoriting property:', error);
        res.status(500).json({ error: error.message });
    }
});

// Contact agent for a specific property
router.post('/:id/contact-agent', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner');
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const agent = property.owner;
        if (!agent || agent.role !== 'agent') {
            return res.status(404).json({ error: 'Agent not found for this property' });
        }

        const { name, email, phone, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required.' });
        }

        // Send email to agent
        try {
            await emailService.sendContactAgentEmail(
                agent,
                property,
                { name, email, phone, message }
            );
            console.log(`Contact email sent to agent ${agent.email} for property ${property.title}`);
        } catch (emailError) {
            console.error('Failed to send contact email to agent:', emailError);
            // Don't fail the request if email fails, just log it
        }

        // Send confirmation email to user
        try {
            await emailService.sendInquiryConfirmationEmail(
                email,
                name,
                property
            );
            console.log(`Confirmation email sent to user ${email}`);
        } catch (emailError) {
            console.error('Failed to send confirmation email to user:', emailError);
            // Don't fail the request if email fails, just log it
        }

        res.json({ message: 'Inquiry sent successfully to the agent.' });

    } catch (error) {
        console.error('Error contacting agent:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
