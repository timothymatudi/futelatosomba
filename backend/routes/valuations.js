// Valuation routes: estimate property value from comparable listings
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Property = require('../models/Property');

// Minimum number of comparables before widening the search
const MIN_COMPS = 3;

// Fallback base price per square meter (USD) when no comparables exist
const BASE_PRICE_PER_SQM = {
    house: 800,
    apartment: 600,
    land: 150,
    commercial: 1000
};

// Condition adjustment applied to the estimate
const CONDITION_MULTIPLIER = {
    excellent: 1.15,
    good: 1.0,
    fair: 0.85,
    poor: 0.7
};

// The Property model stores propertyType capitalized (e.g. "House"), while the
// valuation form submits lowercase values. Map them so the comparable-listing
// query actually matches stored documents.
const PROPERTY_TYPE_DB = {
    house: 'House',
    apartment: 'Apartment',
    land: 'Land',
    commercial: 'Commercial'
};

// Estimate property value from comparable sale listings in the database
router.post('/estimate',
    [
        body('propertyType').isIn(['house', 'apartment', 'land', 'commercial']).withMessage('Invalid property type'),
        body('city').trim().notEmpty().withMessage('City is required'),
        body('bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative number'),
        body('bathrooms').isFloat({ min: 0 }).withMessage('Bathrooms must be a non-negative number'),
        body('area').isFloat({ gt: 0 }).withMessage('Area must be a positive number'),
        body('fullName').trim().notEmpty().withMessage('Full name is required'),
        body('email').isEmail().withMessage('A valid email is required'),
        body('condition').optional({ checkFalsy: true }).isIn(['excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid valuation details',
                    errors: errors.array()
                });
            }

            const { propertyType, city, bedrooms, area, condition } = req.body;
            const bedroomCount = Number(bedrooms);
            const areaSqm = Number(area);
            const conditionFactor = CONDITION_MULTIPLIER[condition] || 1.0;
            const dbPropertyType = PROPERTY_TYPE_DB[propertyType] || propertyType;

            const baseQuery = {
                'location.city': new RegExp(String(city).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
                listingType: 'sale',
                price: { $gt: 0 }
            };

            // Start narrow (city + type + bedrooms) and widen if too few comps
            const queries = [
                { ...baseQuery, propertyType: dbPropertyType, bedrooms: bedroomCount },
                { ...baseQuery, propertyType: dbPropertyType },
                { ...baseQuery }
            ];

            let comps = [];
            for (const query of queries) {
                comps = await Property.find(query).select('price').limit(50);
                if (comps.length >= MIN_COMPS) {
                    break;
                }
            }

            let estimatedValue;
            let summary;

            if (comps.length > 0) {
                const avgPrice = comps.reduce((sum, comp) => sum + comp.price, 0) / comps.length;
                estimatedValue = Math.round(avgPrice * conditionFactor);
                summary = `Based on ${comps.length} comparable ${comps.length === 1 ? 'listing' : 'listings'} for sale in ${city}, adjusted for your property's details and current market conditions.`;
            } else {
                // No comparables: fall back to a base price per square meter
                const basePricePerSqm = BASE_PRICE_PER_SQM[propertyType];
                estimatedValue = Math.round(areaSqm * basePricePerSqm * conditionFactor);
                summary = `No comparable listings were found in ${city}, so this estimate uses average market rates per square meter for ${propertyType} properties.`;
            }

            const minValue = Math.round(estimatedValue * 0.85);
            const maxValue = Math.round(estimatedValue * 1.15);

            res.json({
                success: true,
                data: {
                    estimatedValue,
                    minValue,
                    maxValue,
                    summary
                }
            });
        } catch (error) {
            console.error('Error calculating valuation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to calculate valuation'
            });
        }
    }
);

module.exports = router;
