const test = require('node:test');
const assert = require('node:assert/strict');
const { mergePropertyImages } = require('../utils/mergePropertyImages');

test('existingImages controls deletion, ordering, captions and primary image', () => {
    const result = mergePropertyImages({
        currentImages: [
            { url: '/old-a.jpg', isPrimary: true },
            { url: '/old-b.jpg', isPrimary: false }
        ],
        existingImages: JSON.stringify([
            { url: '/old-b.jpg', caption: 'Front', isPrimary: true }
        ])
    });

    assert.deepEqual(result, [
        { url: '/old-b.jpg', caption: 'Front', isPrimary: true }
    ]);
});

test('new uploads append and the helper guarantees exactly one primary', () => {
    const result = mergePropertyImages({
        currentImages: [{ url: '/old.jpg', isPrimary: false }],
        processedImages: [
            { image: '/new-a.jpg' },
            { image: '/new-b.jpg', isPrimary: true }
        ]
    });

    assert.deepEqual(result, [
        { url: '/old.jpg', isPrimary: false },
        { url: '/new-a.jpg', isPrimary: false },
        { url: '/new-b.jpg', isPrimary: true }
    ]);
    assert.equal(result.filter((img) => img.isPrimary).length, 1);
});

test('empty retained list deletes every existing image', () => {
    const result = mergePropertyImages({
        currentImages: [{ url: '/old.jpg', isPrimary: true }],
        existingImages: '[]'
    });

    assert.deepEqual(result, []);
});

test('existingImages cannot attach a URL that is not already on the property', () => {
    const result = mergePropertyImages({
        currentImages: [
            { url: '/uploads/properties/owned.jpg', isPrimary: true }
        ],
        existingImages: [
            { url: '/uploads/properties/not-owned.jpg', isPrimary: true },
            { url: '/uploads/properties/owned.jpg', isPrimary: false }
        ]
    });

    assert.deepEqual(result, [
        { url: '/uploads/properties/owned.jpg', isPrimary: true }
    ]);
});
