// Property model for real estate listings
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a property title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a property description'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative']
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'CDF', 'EUR']
    },
    listingType: {
        type: String,
        required: [true, 'Please specify listing type'],
        enum: ['sale', 'rent'],
        default: 'sale'
    },
    propertyType: {
        type: String,
        required: [true, 'Please specify property type'],
        enum: ['House', 'Apartment', 'Villa', 'Commercial', 'Land'],
        default: 'House'
    },
    bedrooms: {
        type: Number,
        min: 0,
        default: 0
    },
    bathrooms: {
        type: Number,
        min: 0,
        default: 0
    },
    area: {
        type: Number,
        required: [true, 'Please provide property area'],
        min: [1, 'Area must be at least 1 square meter']
    },
    areaUnit: {
        type: String,
        default: 'm²',
        enum: ['m²', 'ft²']
    },
    location: {
        address: {
            type: String,
            required: [true, 'Please provide an address']
        },
        city: {
            type: String,
            required: [true, 'Please provide a city'],
            default: 'Kinshasa'
        },
        province: {
            type: String
        },
        country: {
            type: String,
            default: 'Democratic Republic of Congo'
        },
        coordinates: {
            lat: {
                type: Number,
                required: [true, 'Please provide latitude'],
                min: [-90, 'Latitude must be between -90 and 90'],
                max: [90, 'Latitude must be between -90 and 90']
            },
            lng: {
                type: Number,
                required: [true, 'Please provide longitude'],
                min: [-180, 'Longitude must be between -180 and 180'],
                max: [180, 'Longitude must be between -180 and 180']
            }
        },
        zipCode: String,
        // GeoJSON format for geospatial queries
        geoLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            }
        }
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        caption: String,
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    features: [{
        type: String,
        trim: true
    }],
    amenities: [{
        type: String,
        enum: [
            'Parking',
            'Garden',
            'Pool',
            'Security',
            'Gym',
            'Generator',
            'Water Tank',
            'Internet',
            'Air Conditioning',
            'Heating',
            'Balcony',
            'Terrace',
            'Elevator',
            'Furnished'
        ]
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Property must have an owner']
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    premiumExpiresAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'sold', 'rented', 'inactive'],
        default: 'pending'
    },
    views: {
        type: Number,
        default: 0
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    yearBuilt: {
        type: Number,
        min: [1800, 'Year built seems too old'],
        max: [new Date().getFullYear(), 'Year cannot be in the future']
    },
    availableFrom: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Pre-save middleware to automatically populate geoLocation from coordinates
propertySchema.pre('save', function(next) {
    if (this.location && this.location.coordinates && this.location.coordinates.lat && this.location.coordinates.lng) {
        // GeoJSON format uses [longitude, latitude] order
        this.location.geoLocation = {
            type: 'Point',
            coordinates: [this.location.coordinates.lng, this.location.coordinates.lat]
        };
    }
    next();
});

// Indexes for better query performance
propertySchema.index({ 'location.city': 1, listingType: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ 'location.coordinates.lat': 1, 'location.coordinates.lng': 1 });
propertySchema.index({ views: -1 });
// 2dsphere index for geospatial queries
propertySchema.index({ 'location.geoLocation': '2dsphere' });

// Virtual for primary image
propertySchema.virtual('primaryImage').get(function() {
    const primary = this.images.find(img => img.isPrimary);
    return primary ? primary.url : (this.images[0]?.url || 'https://via.placeholder.com/800x600?text=No+Image');
});

// Method to increment views
propertySchema.methods.incrementViews = async function() {
    this.views += 1;
    return await this.save();
};

// Method to check if premium is active
propertySchema.methods.isPremiumActive = function() {
    if (!this.isPremium) return false;
    if (!this.premiumExpiresAt) return false;
    return new Date() < this.premiumExpiresAt;
};

// Static method to find properties by location
propertySchema.statics.findByLocation = function(city, radius = 10) {
    return this.find({
        'location.city': new RegExp(city, 'i'),
        status: 'active'
    });
};

module.exports = mongoose.model('Property', propertySchema);
