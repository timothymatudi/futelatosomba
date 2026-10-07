function parseJson(value, fallback) {
    if (typeof value !== 'string') return value ?? fallback;
    try {
        return JSON.parse(value);
    } catch (e) {
        return fallback;
    }
}

function normalizeList(value) {
    if (Array.isArray(value)) return value;
    if (!value) return [];

    const parsed = parseJson(value, null);
    if (Array.isArray(parsed)) return parsed;
    return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function normalizePropertyPayload(body = {}) {
    const normalized = { ...body };
    const locationKeys = ['address', 'city', 'commune', 'province', 'country', 'zipCode'];
    const hasLocationInput = body.location !== undefined
        || locationKeys.some((key) => body[key] !== undefined)
        || body.latitude !== undefined
        || body.longitude !== undefined
        || body.lat !== undefined
        || body.lng !== undefined;

    if (!hasLocationInput) {
        if (body.features !== undefined) normalized.features = normalizeList(body.features);
        if (body.amenities !== undefined) normalized.amenities = normalizeList(body.amenities);
        return normalized;
    }

    const parsedLocation = parseJson(body.location, {});
    const location = parsedLocation && typeof parsedLocation === 'object' ? { ...parsedLocation } : {};
    const parsedCoordinates = parseJson(location.coordinates, {});
    const coordinates = parsedCoordinates && typeof parsedCoordinates === 'object'
        ? { ...parsedCoordinates }
        : {};

    locationKeys.forEach((key) => {
        if (body[key] !== undefined && body[key] !== '') location[key] = body[key];
    });

    const lat = body.latitude ?? body.lat ?? coordinates.lat;
    const lng = body.longitude ?? body.lng ?? coordinates.lng;
    if (lat !== undefined && lat !== '') coordinates.lat = Number(lat);
    if (lng !== undefined && lng !== '') coordinates.lng = Number(lng);

    location.coordinates = coordinates;
    normalized.location = location;

    if (body.features !== undefined) normalized.features = normalizeList(body.features);
    if (body.amenities !== undefined) normalized.amenities = normalizeList(body.amenities);

    return normalized;
}

function normalizePropertyRequest(req, res, next) {
    req.body = normalizePropertyPayload(req.body);
    next();
}

module.exports = {
    normalizePropertyPayload,
    normalizePropertyRequest,
    normalizeList
};
