const test = require('node:test');
const assert = require('node:assert/strict');
const {
    isFrequencyDue,
    buildAlertMatchQuery,
    renderAlertEmail
} = require('../utils/propertyAlertScheduler');

const NOW = new Date('2026-07-22T12:00:00.000Z');

test('isFrequencyDue respects instant, daily and weekly schedules', () => {
    assert.equal(isFrequencyDue({ frequency: 'instant' }, NOW), true);
    assert.equal(isFrequencyDue({
        frequency: 'daily',
        lastNotifiedAt: new Date('2026-07-22T01:00:00.000Z')
    }, NOW), false);
    assert.equal(isFrequencyDue({
        frequency: 'daily',
        lastNotifiedAt: new Date('2026-07-21T11:59:59.000Z')
    }, NOW), true);
    assert.equal(isFrequencyDue({
        frequency: 'weekly',
        lastNotifiedAt: new Date('2026-07-16T12:00:00.000Z')
    }, NOW), false);
    assert.equal(isFrequencyDue({
        frequency: 'weekly',
        lastNotifiedAt: new Date('2026-07-15T11:59:59.000Z')
    }, NOW), true);
});

test('buildAlertMatchQuery defaults to active listings and only newer changes', () => {
    const createdAt = new Date('2026-07-20T10:00:00.000Z');
    const query = buildAlertMatchQuery({
        query: { city: 'Kinshasa', maxPrice: 200000 },
        createdAt
    });

    assert.equal(query.$and[0].status, 'active');
    assert.deepEqual(query.$and[0].price, { $lte: 200000 });
    assert.ok(query.$and[0]['location.city'] instanceof RegExp);
    assert.deepEqual(query.$and[1], {
        $or: [
            { createdAt: { $gt: createdAt } },
            { updatedAt: { $gt: createdAt } }
        ]
    });
});

test('buildAlertMatchQuery preserves an explicitly saved status', () => {
    const query = buildAlertMatchQuery({
        query: { status: 'pending' },
        createdAt: NOW
    });

    assert.equal(query.$and[0].status, 'pending');
});

test('renderAlertEmail escapes user-controlled HTML', () => {
    const email = renderAlertEmail(
        { firstName: '<img src=x onerror=alert(1)>' },
        { name: '<script>alert(1)</script>' },
        [{
            _id: 'property-1',
            title: '<b>Unsafe title</b>',
            price: 100,
            currency: 'USD',
            bedrooms: 1,
            bathrooms: 1,
            location: { address: '<i>Unsafe address</i>' }
        }]
    );

    assert.doesNotMatch(email.html, /<script>|<img|<b>|<i>/);
    assert.match(email.html, /&lt;script&gt;/);
    assert.match(email.html, /&lt;b&gt;Unsafe title&lt;\/b&gt;/);
});
