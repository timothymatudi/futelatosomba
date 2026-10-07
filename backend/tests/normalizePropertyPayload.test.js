const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizePropertyPayload } = require('../utils/normalizePropertyPayload');

test('normalizes flat multipart property fields into nested location data', () => {
    const result = normalizePropertyPayload({
        address: '1 Main Street',
        city: 'Kinshasa',
        commune: 'Gombe',
        province: 'Kinshasa',
        latitude: '-4.3276',
        longitude: '15.3136',
        amenities: '["Parking","Pool"]',
        features: 'garden,balcony'
    });

    assert.deepEqual(result.location, {
        address: '1 Main Street',
        city: 'Kinshasa',
        commune: 'Gombe',
        province: 'Kinshasa',
        coordinates: { lat: -4.3276, lng: 15.3136 }
    });
    assert.deepEqual(result.amenities, ['Parking', 'Pool']);
    assert.deepEqual(result.features, ['garden', 'balcony']);
});

test('accepts a JSON location payload', () => {
    const result = normalizePropertyPayload({
        location: JSON.stringify({
            address: 'Avenue',
            city: 'Lubumbashi',
            coordinates: { lat: -11.67, lng: 27.48 }
        })
    });

    assert.equal(result.location.city, 'Lubumbashi');
    assert.equal(result.location.coordinates.lng, 27.48);
});
