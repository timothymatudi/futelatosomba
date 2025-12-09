// Migration script to add geoLocation field to existing properties
// This script updates all properties that have lat/lng coordinates but missing geoLocation

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Define Property schema (minimal version for migration)
const propertySchema = new mongoose.Schema({
    location: {
        coordinates: {
            lat: Number,
            lng: Number
        },
        geoLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number]
            }
        }
    }
}, { strict: false });

const Property = mongoose.model('Property', propertySchema);

// Migration function
const migrateGeoLocation = async () => {
    try {
        console.log('Starting geoLocation migration...\n');

        // Find all properties that have lat/lng but missing or invalid geoLocation
        const properties = await Property.find({
            'location.coordinates.lat': { $exists: true },
            'location.coordinates.lng': { $exists: true }
        });

        console.log(`Found ${properties.length} properties to process\n`);

        let updated = 0;
        let skipped = 0;
        let errors = 0;

        for (const property of properties) {
            try {
                const lat = property.location?.coordinates?.lat;
                const lng = property.location?.coordinates?.lng;

                // Validate coordinates
                if (typeof lat !== 'number' || typeof lng !== 'number') {
                    console.log(`Skipping property ${property._id}: Invalid coordinates type`);
                    skipped++;
                    continue;
                }

                if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                    console.log(`Skipping property ${property._id}: Coordinates out of range (lat: ${lat}, lng: ${lng})`);
                    skipped++;
                    continue;
                }

                // Check if geoLocation already exists and is valid
                const existingGeoLocation = property.location?.geoLocation;
                if (existingGeoLocation &&
                    existingGeoLocation.type === 'Point' &&
                    Array.isArray(existingGeoLocation.coordinates) &&
                    existingGeoLocation.coordinates.length === 2 &&
                    existingGeoLocation.coordinates[0] === lng &&
                    existingGeoLocation.coordinates[1] === lat) {
                    console.log(`Property ${property._id} already has valid geoLocation`);
                    skipped++;
                    continue;
                }

                // Update property with geoLocation
                await Property.updateOne(
                    { _id: property._id },
                    {
                        $set: {
                            'location.geoLocation': {
                                type: 'Point',
                                coordinates: [lng, lat] // GeoJSON format: [longitude, latitude]
                            }
                        }
                    }
                );

                console.log(`Updated property ${property._id} with geoLocation: [${lng}, ${lat}]`);
                updated++;

            } catch (error) {
                console.error(`Error updating property ${property._id}:`, error.message);
                errors++;
            }
        }

        console.log('\n=== Migration Summary ===');
        console.log(`Total properties processed: ${properties.length}`);
        console.log(`Successfully updated: ${updated}`);
        console.log(`Skipped (already valid): ${skipped}`);
        console.log(`Errors: ${errors}`);
        console.log('========================\n');

        // Create 2dsphere index if it doesn't exist
        console.log('Ensuring 2dsphere index exists...');
        try {
            await Property.collection.createIndex({ 'location.geoLocation': '2dsphere' });
            console.log('2dsphere index created successfully');
        } catch (error) {
            if (error.code === 85 || error.code === 86) {
                // Index already exists with different options or index with same name but different key
                console.log('2dsphere index already exists');
            } else {
                console.error('Error creating 2dsphere index:', error.message);
            }
        }

        console.log('\nMigration completed!');

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
};

// Run migration
const runMigration = async () => {
    try {
        await connectDB();
        await migrateGeoLocation();
        console.log('\nClosing database connection...');
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Migration script error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Execute if run directly
if (require.main === module) {
    runMigration();
}

module.exports = { migrateGeoLocation };
