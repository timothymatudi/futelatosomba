// Shared helper that turns a saved-search / alert filter object into a
// MongoDB query. Kept in sync with the filters accepted by GET /api/properties
// so property alerts match exactly what a user would see when browsing.

const ALLOWED_PROPERTY_SORT_FIELDS = new Set([
    'createdAt',
    'updatedAt',
    'price',
    'bedrooms',
    'bathrooms',
    'area',
    'views',
    'newListingUntil',
    'isPremium',
    'isExclusive'
]);
const PUBLIC_PROPERTY_STATUSES = new Set(['active', 'sold', 'rented']);

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSafePropertySortField(value, fallback = 'createdAt') {
    return ALLOWED_PROPERTY_SORT_FIELDS.has(value) ? value : fallback;
}

function getPublicPropertyStatus(value) {
    return PUBLIC_PROPERTY_STATUSES.has(value) ? value : 'active';
}

function isPublicPropertyStatus(value) {
    return PUBLIC_PROPERTY_STATUSES.has(value);
}

function buildPropertyQuery(filters = {}) {
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
        features,
        amenities,
        minYearBuilt,
        maxYearBuilt,
        status,
        isPremium,
        isExclusive,
        isNew,
        owner
    } = filters;

    const query = {};

    if (listingType) query.listingType = listingType;
    if (propertyType && propertyType !== 'any') query.propertyType = propertyType;
    if (city) query['location.city'] = new RegExp(escapeRegExp(city), 'i');
    if (location) query['location.address'] = new RegExp(escapeRegExp(location), 'i');
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
        const searchRegExp = new RegExp(escapeRegExp(search), 'i');
        query.$or = [
            { title: searchRegExp },
            { description: searchRegExp },
            { 'location.address': searchRegExp },
            { 'location.city': searchRegExp }
        ];
    }

    if (features) {
        query.features = { $all: Array.isArray(features) ? features : String(features).split(',') };
    }
    if (amenities) {
        query.amenities = { $all: Array.isArray(amenities) ? amenities : String(amenities).split(',') };
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
    if (isPremium !== undefined && isPremium !== '') {
        query.isPremium = isPremium === true || isPremium === 'true';
    }
    if (isExclusive !== undefined && isExclusive !== '') {
        query.isExclusive = isExclusive === true || isExclusive === 'true';
    }
    if (isNew === true || isNew === 'true') {
        query.newListingUntil = { $gt: new Date() };
    }
    if (owner) {
        query.owner = owner;
    }

    return query;
}

module.exports = {
    buildPropertyQuery,
    escapeRegExp,
    getSafePropertySortField,
    getPublicPropertyStatus,
    isPublicPropertyStatus,
    ALLOWED_PROPERTY_SORT_FIELDS,
    PUBLIC_PROPERTY_STATUSES
};
