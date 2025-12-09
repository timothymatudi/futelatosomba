# Geospatial Search API Documentation

This document provides comprehensive documentation for the geospatial search features implemented in the Futelatosomba property listing platform.

## Overview

The API now supports three types of location-based queries:
1. **Nearby Search** - Find properties within a radius from a point
2. **Bounding Box Search** - Find properties within map bounds
3. **Distance-Based Sorting** - Sort all properties by distance from a point

All geospatial features use MongoDB's 2dsphere index for efficient queries and accurate distance calculations on a sphere (Earth).

---

## Endpoints

### 1. Nearby Search (Radius-based)

Find properties within a specified radius from a geographic point.

**Endpoint:** `GET /api/properties/nearby`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| lat | Number | Yes | - | Latitude of search center (-90 to 90) |
| lng | Number | Yes | - | Longitude of search center (-180 to 180) |
| radius | Number | No | 10 | Search radius in kilometers (must be positive) |
| listingType | String | No | - | 'sale' or 'rent' |
| propertyType | String | No | - | 'House', 'Apartment', 'Villa', 'Commercial', 'Land' |
| minPrice | Number | No | - | Minimum price filter |
| maxPrice | Number | No | - | Maximum price filter |
| bedrooms | Number/String | No | - | Minimum bedrooms (or '4+') |
| bathrooms | Number | No | - | Minimum bathrooms |
| minArea | Number | No | - | Minimum area in square meters |
| maxArea | Number | No | - | Maximum area in square meters |
| features | String/Array | No | - | Comma-separated features (must have all) |
| amenities | String/Array | No | - | Comma-separated amenities (must have all) |
| status | String | No | 'active' | Property status filter |
| isPremium | Boolean | No | - | Filter premium properties |
| sortBy | String | No | 'distance' | Sort field (distance is default) |
| page | Number | No | 1 | Page number for pagination |
| limit | Number | No | 12 | Results per page (max 50) |

**Example Request:**
```bash
GET /api/properties/nearby?lat=-4.3276&lng=15.3136&radius=5&listingType=sale&minPrice=50000&maxPrice=200000&bedrooms=3&page=1&limit=10
```

**Example Response:**
```json
{
  "properties": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Modern 3-Bedroom House",
      "price": 120000,
      "location": {
        "address": "123 Main St",
        "city": "Kinshasa",
        "coordinates": {
          "lat": -4.3250,
          "lng": 15.3100
        }
      },
      "distance": 450.25,
      "distanceKm": 0.45,
      "owner": {
        "_id": "507f1f77bcf86cd799439012",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      }
    }
  ],
  "searchCenter": {
    "lat": -4.3276,
    "lng": 15.3136
  },
  "radiusKm": 5,
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 28,
    "itemsPerPage": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Key Features:**
- Properties are sorted by distance (closest first)
- Distance is returned in both meters (`distance`) and kilometers (`distanceKm`)
- Supports all standard property filters
- Validates coordinate ranges
- Returns search center coordinates for reference

**Error Responses:**

```json
// Missing coordinates
{
  "error": "Latitude and longitude are required",
  "message": "Please provide both lat and lng parameters"
}

// Invalid latitude
{
  "error": "Invalid latitude",
  "message": "Latitude must be a number between -90 and 90"
}

// Invalid longitude
{
  "error": "Invalid longitude",
  "message": "Longitude must be a number between -180 and 180"
}

// Invalid radius
{
  "error": "Invalid radius",
  "message": "Radius must be a positive number"
}
```

---

### 2. Bounding Box Search

Find properties within a rectangular map bounds (useful for map-based interfaces).

**Endpoint:** `GET /api/properties/bounds`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| neLat | Number | Yes | - | Northeast corner latitude |
| neLng | Number | Yes | - | Northeast corner longitude |
| swLat | Number | Yes | - | Southwest corner latitude |
| swLng | Number | Yes | - | Southwest corner longitude |
| listingType | String | No | - | 'sale' or 'rent' |
| propertyType | String | No | - | Property type filter |
| minPrice | Number | No | - | Minimum price filter |
| maxPrice | Number | No | - | Maximum price filter |
| bedrooms | Number/String | No | - | Minimum bedrooms |
| bathrooms | Number | No | - | Minimum bathrooms |
| minArea | Number | No | - | Minimum area |
| maxArea | Number | No | - | Maximum area |
| features | String/Array | No | - | Required features |
| amenities | String/Array | No | - | Required amenities |
| status | String | No | 'active' | Property status |
| isPremium | Boolean | No | - | Premium filter |
| sortBy | String | No | 'createdAt' | Sort field |
| sortOrder | String | No | 'desc' | 'asc' or 'desc' |
| page | Number | No | 1 | Page number |
| limit | Number | No | 50 | Results per page (max 100) |

**Example Request:**
```bash
GET /api/properties/bounds?neLat=-4.3000&neLng=15.4000&swLat=-4.4000&swLng=15.2000&listingType=sale
```

**Example Response:**
```json
{
  "properties": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Luxury Villa",
      "price": 350000,
      "location": {
        "address": "456 Ocean Dr",
        "city": "Kinshasa",
        "coordinates": {
          "lat": -4.3500,
          "lng": 15.3500
        }
      }
    }
  ],
  "bounds": {
    "northEast": {
      "lat": -4.3000,
      "lng": 15.4000
    },
    "southWest": {
      "lat": -4.4000,
      "lng": 15.2000
    }
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 45,
    "itemsPerPage": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Key Features:**
- Returns all properties within the rectangular bounds
- Efficient $geoWithin query using $box operator
- Supports all standard property filters
- Validates bounding box coordinates
- Higher default limit (50) for map views

**Error Responses:**

```json
// Missing bounds
{
  "error": "Bounding box coordinates required",
  "message": "Please provide neLat, neLng, swLat, and swLng parameters"
}

// Invalid coordinates
{
  "error": "Invalid latitude",
  "message": "Latitude values must be between -90 and 90"
}

// Invalid bounding box
{
  "error": "Invalid bounding box",
  "message": "North-East latitude must be greater than South-West latitude"
}
```

---

### 3. Distance-Based Sorting (Enhanced GET endpoint)

Sort all properties by distance from a specific point while applying other filters.

**Endpoint:** `GET /api/properties`

**New Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| sortByDistance | Boolean | No | false | Enable distance-based sorting |
| lat | Number | Conditional* | - | Reference point latitude |
| lng | Number | Conditional* | - | Reference point longitude |

*Required when `sortByDistance=true`

**Example Request:**
```bash
GET /api/properties?sortByDistance=true&lat=-4.3276&lng=15.3136&listingType=sale&minPrice=100000&page=1&limit=12
```

**Example Response:**
```json
{
  "properties": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Beachfront Property",
      "distance": 1250.5,
      "distanceKm": 1.25
    }
  ],
  "sortedByDistance": true,
  "referencePoint": {
    "lat": -4.3276,
    "lng": 15.3136
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 58,
    "itemsPerPage": 12,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Key Features:**
- Works with all existing filters
- No radius limitation (returns all matching properties sorted by distance)
- Backward compatible (existing queries work unchanged)
- Returns `sortedByDistance: true` flag in response

---

## Data Model

### Property Schema - Location Field

```javascript
location: {
  address: String,
  city: String,
  province: String,
  country: String,
  coordinates: {
    lat: Number,    // -90 to 90
    lng: Number     // -180 to 180
  },
  zipCode: String,
  geoLocation: {    // GeoJSON format for geospatial queries
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]  // [longitude, latitude]
  }
}
```

### Indexes

```javascript
// 2dsphere index for geospatial queries
propertySchema.index({ 'location.geoLocation': '2dsphere' });

// Other indexes
propertySchema.index({ 'location.city': 1, listingType: 1 });
propertySchema.index({ 'location.coordinates.lat': 1, 'location.coordinates.lng': 1 });
```

---

## Migration

### Migrating Existing Data

If you have existing properties without the `geoLocation` field, run the migration script:

```bash
node scripts/migrateGeoLocation.js
```

**What the script does:**
1. Finds all properties with lat/lng coordinates
2. Validates coordinate ranges
3. Creates GeoJSON `geoLocation` field from lat/lng
4. Creates 2dsphere index
5. Provides detailed migration summary

**Migration Output:**
```
Starting geoLocation migration...

Found 150 properties to process

Updated property 507f1f77bcf86cd799439011 with geoLocation: [15.3136, -4.3276]
Updated property 507f1f77bcf86cd799439012 with geoLocation: [15.3200, -4.3300]
...

=== Migration Summary ===
Total properties processed: 150
Successfully updated: 145
Skipped (already valid): 5
Errors: 0
========================

Ensuring 2dsphere index exists...
2dsphere index created successfully

Migration completed!
```

### Automatic GeoLocation Population

For new properties, the `geoLocation` field is automatically populated via a pre-save middleware:

```javascript
propertySchema.pre('save', function(next) {
  if (this.location?.coordinates?.lat && this.location?.coordinates?.lng) {
    this.location.geoLocation = {
      type: 'Point',
      coordinates: [this.location.coordinates.lng, this.location.coordinates.lat]
    };
  }
  next();
});
```

---

## Use Cases

### 1. "Find Properties Near Me"

```bash
# Get user's current location (lat, lng) from browser
# Search for properties within 3km
GET /api/properties/nearby?lat=-4.3276&lng=15.3136&radius=3&status=active
```

### 2. Map-Based Search

```bash
# User drags/zooms map, get visible bounds
# Fetch all properties in visible area
GET /api/properties/bounds?neLat=-4.30&neLng=15.40&swLat=-4.40&swLng=15.20&status=active
```

### 3. "Sort by Distance from Downtown"

```bash
# Sort all properties by distance from city center
GET /api/properties?sortByDistance=true&lat=-4.3276&lng=15.3136&city=Kinshasa&listingType=sale
```

### 4. Filtered Nearby Search

```bash
# Find 3+ bedroom houses for sale within 10km, price range 100k-500k
GET /api/properties/nearby?lat=-4.3276&lng=15.3136&radius=10&listingType=sale&propertyType=House&bedrooms=3&minPrice=100000&maxPrice=500000
```

### 5. Premium Properties in Area

```bash
# Find premium properties within bounds
GET /api/properties/bounds?neLat=-4.30&neLng=15.40&swLat=-4.40&swLng=15.20&isPremium=true&status=active
```

---

## Performance Considerations

### Index Usage

All geospatial queries use the `2dsphere` index for optimal performance:
- **Nearby search**: Uses `$geoNear` aggregation (requires 2dsphere index)
- **Bounds search**: Uses `$geoWithin` with `$box` operator
- **Distance sorting**: Uses `$geoNear` aggregation

### Query Optimization Tips

1. **Limit radius**: Smaller radius = faster queries
2. **Use bounds for maps**: More efficient than large radius searches
3. **Combine filters**: Pre-filter by city, type, etc. before geospatial search
4. **Pagination**: Use reasonable page sizes (12-50 items)
5. **Index other fields**: Ensure frequently filtered fields are indexed

### Expected Performance

- **Nearby search**: ~50-100ms for 10,000 properties
- **Bounds search**: ~30-80ms for 10,000 properties
- **Distance sorting**: ~100-200ms for 10,000 properties

---

## Error Handling

All endpoints include comprehensive error handling:

### Validation Errors (400)
- Missing required parameters
- Invalid coordinate ranges
- Invalid data types
- Invalid bounding box logic

### Server Errors (500)
- Database connection issues
- Aggregation pipeline errors
- Unexpected errors

All errors return consistent format:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

---

## Edge Cases Handled

1. **Invalid Coordinates**
   - Latitude outside -90 to 90
   - Longitude outside -180 to 180
   - Non-numeric values

2. **Invalid Radius**
   - Negative radius
   - Zero radius
   - Non-numeric radius

3. **Invalid Bounding Box**
   - NE latitude <= SW latitude
   - Coordinates out of range

4. **Missing Data**
   - Properties without geoLocation (excluded from results)
   - Properties with invalid coordinates (excluded)

5. **Pagination Edge Cases**
   - Page number < 1 (defaults to 1)
   - Limit > max allowed (capped to max)
   - Empty result sets

6. **Distance Calculation**
   - Properly handles spherical earth calculations
   - Accurate for all latitudes and longitudes
   - Handles International Date Line crossing

---

## Testing

### Manual Testing Examples

```bash
# Test nearby search
curl "http://localhost:5000/api/properties/nearby?lat=-4.3276&lng=15.3136&radius=5"

# Test bounds search
curl "http://localhost:5000/api/properties/bounds?neLat=-4.30&neLng=15.40&swLat=-4.40&swLng=15.20"

# Test distance sorting
curl "http://localhost:5000/api/properties?sortByDistance=true&lat=-4.3276&lng=15.3136"

# Test with filters
curl "http://localhost:5000/api/properties/nearby?lat=-4.3276&lng=15.3136&radius=10&listingType=sale&bedrooms=3&minPrice=100000"

# Test error handling
curl "http://localhost:5000/api/properties/nearby?lat=200&lng=15.3136"  # Invalid lat
curl "http://localhost:5000/api/properties/nearby?lat=-4.3276"          # Missing lng
```

### Integration Testing

See the test suite examples in the repository for automated testing of:
- Coordinate validation
- Distance calculations
- Filter combinations
- Pagination
- Error scenarios

---

## Frontend Integration

### Example: React with Leaflet

```javascript
// Fetch properties near user location
const fetchNearbyProperties = async (userLat, userLng, radius = 5) => {
  const response = await fetch(
    `/api/properties/nearby?lat=${userLat}&lng=${userLng}&radius=${radius}&status=active`
  );
  const data = await response.json();
  return data.properties;
};

// Fetch properties in map bounds
const fetchPropertiesInBounds = async (bounds) => {
  const { neLat, neLng, swLat, swLng } = bounds;
  const response = await fetch(
    `/api/properties/bounds?neLat=${neLat}&neLng=${neLng}&swLat=${swLat}&swLng=${swLng}&status=active`
  );
  const data = await response.json();
  return data.properties;
};

// Display properties on map
const displayOnMap = (properties) => {
  properties.forEach(property => {
    const marker = L.marker([
      property.location.coordinates.lat,
      property.location.coordinates.lng
    ]);
    marker.bindPopup(`
      <h3>${property.title}</h3>
      <p>Price: $${property.price}</p>
      ${property.distanceKm ? `<p>Distance: ${property.distanceKm} km</p>` : ''}
    `);
    marker.addTo(map);
  });
};
```

---

## API Version

Current version: 1.0.0
Last updated: December 2025

## Support

For questions or issues with the geospatial search API, please contact the development team or open an issue in the repository.
