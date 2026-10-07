const test = require('node:test');
const assert = require('node:assert/strict');
const {
    buildPropertyQuery,
    getSafePropertySortField,
    getPublicPropertyStatus
} = require('../utils/buildPropertyQuery');

test('buildPropertyQuery converts property filters into Mongo filters', () => {
    const query = buildPropertyQuery({
        listingType: 'sale',
        propertyType: 'house',
        city: 'Kinshasa',
        minPrice: '100000',
        maxPrice: '400000',
        bedrooms: '4+',
        bathrooms: '2',
        features: 'garden,pool',
        isPremium: 'true',
        isExclusive: false,
        owner: 'owner-1'
    });

    assert.equal(query.listingType, 'sale');
    assert.equal(query.propertyType, 'house');
    assert.ok(query['location.city'] instanceof RegExp);
    assert.deepEqual(query.price, { $gte: 100000, $lte: 400000 });
    assert.deepEqual(query.bedrooms, { $gte: 4 });
    assert.deepEqual(query.bathrooms, { $gte: 2 });
    assert.deepEqual(query.features, { $all: ['garden', 'pool'] });
    assert.equal(query.isPremium, true);
    assert.equal(query.isExclusive, false);
    assert.equal(query.owner, 'owner-1');
});

test('buildPropertyQuery ignores any property type and adds the new-listing window', () => {
    const before = new Date();
    const query = buildPropertyQuery({
        propertyType: 'any',
        bedrooms: 'any',
        isNew: 'true',
        search: 'Gombe'
    });

    assert.equal(query.propertyType, undefined);
    assert.equal(query.bedrooms, undefined);
    assert.ok(query.newListingUntil.$gt instanceof Date);
    assert.ok(query.newListingUntil.$gt >= before);
    assert.equal(query.$or.length, 4);
    assert.ok(query.$or[0].title instanceof RegExp);
});

test('buildPropertyQuery treats regex characters as literal search text', () => {
    const query = buildPropertyQuery({ city: 'Kin(shasa)+', search: 'home.*' });
    assert.equal(query['location.city'].source, 'Kin\\(shasa\\)\\+');
    assert.equal(query.$or[0].title.source, 'home\\.\\*');
});

test('getSafePropertySortField rejects arbitrary Mongo field names', () => {
    assert.equal(getSafePropertySortField('price'), 'price');
    assert.equal(getSafePropertySortField('$where'), 'createdAt');
    assert.equal(getSafePropertySortField('__proto__', 'views'), 'views');
});

test('public status defaults to active and excludes pending/inactive', () => {
    assert.equal(getPublicPropertyStatus(undefined), 'active');
    assert.equal(getPublicPropertyStatus('pending'), 'active');
    assert.equal(getPublicPropertyStatus('inactive'), 'active');
    assert.equal(getPublicPropertyStatus('sold'), 'sold');
    assert.equal(getPublicPropertyStatus('rented'), 'rented');
});
