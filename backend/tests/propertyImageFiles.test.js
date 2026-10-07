const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const {
    getPropertyImagePaths,
    PROPERTY_UPLOAD_DIR
} = require('../utils/propertyImageFiles');

test('maps a stored property URL to safe image and thumbnail paths', () => {
    const paths = getPropertyImagePaths('/uploads/properties/property_123.jpg');
    assert.deepEqual(paths, [
        path.join(PROPERTY_UPLOAD_DIR, 'property_123.jpg'),
        path.join(PROPERTY_UPLOAD_DIR, 'thumb_property_123.jpg')
    ]);
});

test('does not map external or non-property image URLs', () => {
    assert.deepEqual(getPropertyImagePaths('https://example.com/image.jpg'), []);
    assert.deepEqual(getPropertyImagePaths('/uploads/avatars/avatar.jpg'), []);
});
