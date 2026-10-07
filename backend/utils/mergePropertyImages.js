// Pure helper to compute the final images array for a property update.
//
// The frontend can send `existingImages` (a JSON array of the images the user
// chose to KEEP, in display order, each optionally flagged isPrimary / caption).
// Newly uploaded files arrive as `processedImages` from the upload middleware.
//
// Rules:
// - If `existingImages` is provided, it replaces the stored set (this is how a
//   user deletes/reorders images); otherwise the current images are kept.
// - Newly uploaded images are appended after the kept ones.
// - Exactly one image is primary. If none is flagged, the first image becomes
//   primary. If several are flagged, only the first flagged one wins.

function normalizeExisting(existingImages) {
    if (existingImages === undefined || existingImages === null) return undefined;

    let list = existingImages;
    if (typeof list === 'string') {
        try {
            list = JSON.parse(list);
        } catch (e) {
            return undefined; // malformed -> treat as "not provided"
        }
    }
    if (!Array.isArray(list)) return undefined;

    return list
        .filter((img) => img && typeof img.url === 'string' && img.url.length > 0)
        .map((img) => ({
            url: img.url,
            caption: typeof img.caption === 'string' ? img.caption : undefined,
            isPrimary: img.isPrimary === true || img.isPrimary === 'true'
        }));
}

function normalizeProcessed(processedImages = []) {
    if (!Array.isArray(processedImages)) return [];
    return processedImages
        .filter((img) => img && (img.image || img.url))
        .map((img) => ({
            url: img.image || img.url,
            caption: typeof img.caption === 'string' ? img.caption : undefined,
            isPrimary: img.isPrimary === true
        }));
}

function enforceSinglePrimary(images) {
    if (images.length === 0) return images;

    let primarySeen = false;
    const result = images.map((img) => {
        const cleaned = { url: img.url };
        if (img.caption) cleaned.caption = img.caption;

        if (img.isPrimary && !primarySeen) {
            cleaned.isPrimary = true;
            primarySeen = true;
        } else {
            cleaned.isPrimary = false;
        }
        return cleaned;
    });

    if (!primarySeen) {
        result[0].isPrimary = true;
    }
    return result;
}

function mergePropertyImages({ currentImages = [], existingImages, processedImages = [] } = {}) {
    const kept = normalizeExisting(existingImages);
    const currentUrls = new Set(
        Array.isArray(currentImages)
            ? currentImages.map((image) => image?.url).filter(Boolean)
            : []
    );
    const base = kept !== undefined
        ? kept.filter((image) => currentUrls.has(image.url))
        : (Array.isArray(currentImages) ? currentImages.map((img) => ({
            url: img.url,
            caption: img.caption,
            isPrimary: img.isPrimary === true
        })) : []);

    const uploaded = normalizeProcessed(processedImages);
    return enforceSinglePrimary([...base, ...uploaded]);
}

module.exports = { mergePropertyImages, normalizeExisting, enforceSinglePrimary };
