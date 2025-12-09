# Geospatial Search - Quick Start Guide

## Setup Instructions

### 1. Run Migration Script

First, migrate existing properties to add the `geoLocation` field:

```bash
cd /data/data/com.termux/files/home/futelatosomba/backend
node scripts/migrateGeoLocation.js
```

This will:
- Add GeoJSON `geoLocation` field to all existing properties
- Create the 2dsphere index for optimal performance
- Validate all coordinates

### 2. Restart Server

After migration, restart your backend server:

```bash
# Stop current server (Ctrl+C)
npm start
# or
node server.js
```

### 3. Verify Setup

Check that the server starts without errors and the 2dsphere index is created.

---

## API Endpoints Summary

### 1. Nearby Search (Radius)
```
GET /api/properties/nearby?lat=-4.3276&lng=15.3136&radius=10
```

**Required:** lat, lng
**Optional:** radius (default: 10km), all property filters, pagination

### 2. Bounding Box Search
```
GET /api/properties/bounds?neLat=-4.30&neLng=15.40&swLat=-4.40&swLng=15.20
```

**Required:** neLat, neLng, swLat, swLng
**Optional:** all property filters, pagination

### 3. Distance-Based Sorting
```
GET /api/properties?sortByDistance=true&lat=-4.3276&lng=15.3136
```

**Required:** sortByDistance=true, lat, lng
**Optional:** all property filters, pagination

---

## Quick Test Commands

### Test 1: Basic Nearby Search
```bash
curl "http://localhost:5000/api/properties/nearby?lat=-4.3276&lng=15.3136&radius=5"
```

### Test 2: Nearby with Filters
```bash
curl "http://localhost:5000/api/properties/nearby?lat=-4.3276&lng=15.3136&radius=10&listingType=sale&bedrooms=3&minPrice=50000&maxPrice=200000"
```

### Test 3: Bounding Box
```bash
curl "http://localhost:5000/api/properties/bounds?neLat=-4.30&neLng=15.40&swLat=-4.40&swLng=15.20&status=active"
```

### Test 4: Distance Sorting
```bash
curl "http://localhost:5000/api/properties?sortByDistance=true&lat=-4.3276&lng=15.3136&city=Kinshasa&page=1&limit=10"
```

### Test 5: Error Handling
```bash
# Invalid latitude (should return error)
curl "http://localhost:5000/api/properties/nearby?lat=200&lng=15.3136&radius=5"

# Missing coordinates (should return error)
curl "http://localhost:5000/api/properties/nearby?radius=5"

# Invalid radius (should return error)
curl "http://localhost:5000/api/properties/nearby?lat=-4.3276&lng=15.3136&radius=-5"
```

---

## Response Format

### Nearby Search Response
```json
{
  "properties": [
    {
      "_id": "...",
      "title": "Property Title",
      "price": 150000,
      "location": {
        "coordinates": {
          "lat": -4.3250,
          "lng": 15.3100
        }
      },
      "distance": 450.25,
      "distanceKm": 0.45
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

### Bounds Search Response
```json
{
  "properties": [...],
  "bounds": {
    "northEast": { "lat": -4.30, "lng": 15.40 },
    "southWest": { "lat": -4.40, "lng": 15.20 }
  },
  "pagination": {...}
}
```

---

## Common Parameters

### Geospatial Parameters
- `lat`: Latitude (-90 to 90)
- `lng`: Longitude (-180 to 180)
- `radius`: Search radius in kilometers (positive number)
- `neLat`, `neLng`: Northeast corner of bounding box
- `swLat`, `swLng`: Southwest corner of bounding box

### Property Filters (all endpoints)
- `listingType`: sale | rent
- `propertyType`: House | Apartment | Villa | Commercial | Land
- `minPrice`, `maxPrice`: Price range
- `bedrooms`: Minimum bedrooms (or "4+")
- `bathrooms`: Minimum bathrooms
- `minArea`, `maxArea`: Area range in m²
- `features`: Comma-separated features
- `amenities`: Comma-separated amenities
- `status`: active | pending | sold | rented | inactive
- `isPremium`: true | false

### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12, max varies by endpoint)
- `sortBy`: Field to sort by (default varies)
- `sortOrder`: asc | desc (default: desc)

---

## Kinshasa Coordinates Reference

Use these approximate coordinates for testing in Kinshasa:

- **City Center (Gombe)**: -4.3276, 15.3136
- **North Kinshasa**: -4.30, 15.32
- **South Kinshasa**: -4.40, 15.32
- **East Kinshasa**: -4.35, 15.40
- **West Kinshasa**: -4.35, 15.20

### Sample Bounding Box (covers most of Kinshasa)
- Northeast: `-4.20, 15.50`
- Southwest: `-4.50, 15.10`

---

## Frontend Integration Example

### Using Fetch API
```javascript
// Nearby search
const searchNearby = async (lat, lng, radius = 5) => {
  const url = new URL('http://localhost:5000/api/properties/nearby');
  url.searchParams.append('lat', lat);
  url.searchParams.append('lng', lng);
  url.searchParams.append('radius', radius);
  url.searchParams.append('status', 'active');

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Search failed');
  }

  return data;
};

// Bounds search
const searchBounds = async (bounds) => {
  const url = new URL('http://localhost:5000/api/properties/bounds');
  url.searchParams.append('neLat', bounds.neLat);
  url.searchParams.append('neLng', bounds.neLng);
  url.searchParams.append('swLat', bounds.swLat);
  url.searchParams.append('swLng', bounds.swLng);
  url.searchParams.append('status', 'active');

  const response = await fetch(url);
  return await response.json();
};
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

const useNearbyProperties = (lat, lng, radius) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/properties/nearby?lat=${lat}&lng=${lng}&radius=${radius}&status=active`
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const data = await response.json();
        setProperties(data.properties);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [lat, lng, radius]);

  return { properties, loading, error };
};

// Usage
function PropertyMap() {
  const userLocation = { lat: -4.3276, lng: 15.3136 };
  const { properties, loading, error } = useNearbyProperties(
    userLocation.lat,
    userLocation.lng,
    5
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {properties.map(property => (
        <PropertyCard
          key={property._id}
          property={property}
          distance={property.distanceKm}
        />
      ))}
    </div>
  );
}
```

---

## Troubleshooting

### Issue: No properties returned
**Solution:**
1. Check if properties have valid coordinates
2. Run migration script: `node scripts/migrateGeoLocation.js`
3. Verify 2dsphere index exists in MongoDB

### Issue: "Invalid coordinates" error
**Solution:**
- Latitude must be between -90 and 90
- Longitude must be between -180 and 180
- Check for typos in parameter names (lat vs latitude)

### Issue: Slow query performance
**Solution:**
1. Ensure 2dsphere index is created
2. Reduce search radius
3. Add filters to narrow down results
4. Check MongoDB index usage with `.explain()`

### Issue: Distance not returned
**Solution:**
- Only nearby search returns distance
- Ensure you're using `/nearby` endpoint, not `/bounds`
- Check for `distance` and `distanceKm` fields in response

---

## Next Steps

1. **Run Migration**: `node scripts/migrateGeoLocation.js`
2. **Test Endpoints**: Use curl commands above
3. **Integrate Frontend**: Use example code snippets
4. **Monitor Performance**: Check query times and optimize as needed
5. **Read Full Documentation**: See `GEOSPATIAL_API.md` for comprehensive details

---

## Support

For detailed documentation, see `GEOSPATIAL_API.md`

For questions or issues, contact the development team.
