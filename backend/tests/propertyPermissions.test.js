const test = require('node:test');
const assert = require('node:assert/strict');

const {
    canManageProperty,
    canManageListingPromotion,
    canSetPropertyStatus
} = require('../utils/propertyPermissions');

test('property owner and admin can manage a property', () => {
    const property = { owner: 'owner-1' };

    assert.equal(canManageProperty({ _id: 'owner-1', role: 'agent' }, property), true);
    assert.equal(canManageProperty({ _id: 'other', role: 'agent' }, property), false);
    assert.equal(canManageProperty({ _id: 'admin-1', role: 'admin' }, property), true);
});

test('only admins or premium users can manage promoted listing flags', () => {
    assert.equal(canManageListingPromotion({ role: 'agent', isPremium: false }), false);
    assert.equal(canManageListingPromotion({ role: 'agent', isPremium: true }), true);
    assert.equal(canManageListingPromotion({ role: 'admin', isPremium: false }), true);
});

test('agents cannot self-approve pending properties', () => {
    const agent = { role: 'agent' };

    assert.equal(canSetPropertyStatus(agent, 'active'), false);
    assert.equal(canSetPropertyStatus(agent, 'pending'), false);
    assert.equal(canSetPropertyStatus(agent, 'sold'), true);
    assert.equal(canSetPropertyStatus(agent, 'rented'), true);
    assert.equal(canSetPropertyStatus(agent, 'inactive'), true);
    assert.equal(canSetPropertyStatus({ role: 'admin' }, 'active'), true);
});
