const OWNER_MUTABLE_STATUSES = new Set(['sold', 'rented', 'inactive']);

function isPropertyOwner(user, property) {
    if (!user?._id || !property?.owner) return false;
    return property.owner.toString() === user._id.toString();
}

function canManageProperty(user, property) {
    return user?.role === 'admin' || isPropertyOwner(user, property);
}

function canManageListingPromotion(user) {
    return user?.role === 'admin' || user?.isPremium === true;
}

function canSetPropertyStatus(user, status) {
    if (status === undefined) return true;
    if (user?.role === 'admin') return true;
    return OWNER_MUTABLE_STATUSES.has(status);
}

module.exports = {
    OWNER_MUTABLE_STATUSES,
    isPropertyOwner,
    canManageProperty,
    canManageListingPromotion,
    canSetPropertyStatus
};
