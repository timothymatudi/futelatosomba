const fs = require('fs/promises');
const path = require('path');

const PROPERTY_UPLOAD_PREFIX = '/uploads/properties/';
const PROPERTY_UPLOAD_DIR = path.resolve(__dirname, '../uploads/properties');

function getPropertyImagePaths(url) {
    if (typeof url !== 'string' || !url.startsWith(PROPERTY_UPLOAD_PREFIX)) return [];

    const filename = path.basename(url.slice(PROPERTY_UPLOAD_PREFIX.length));
    if (!filename || filename === '.' || filename === '..') return [];

    const main = path.join(PROPERTY_UPLOAD_DIR, filename);
    const thumbnail = path.join(PROPERTY_UPLOAD_DIR, `thumb_${filename}`);
    return [main, thumbnail];
}

async function deletePropertyImageFiles(urls = []) {
    const files = [...new Set(urls.flatMap(getPropertyImagePaths))];
    await Promise.all(files.map(async (file) => {
        try {
            await fs.unlink(file);
        } catch (error) {
            // Missing files are already deleted; anything else is worth logging.
            if (error.code !== 'ENOENT') {
                console.error(`Failed to delete property image ${file}:`, error.message);
            }
        }
    }));
}

module.exports = {
    deletePropertyImageFiles,
    getPropertyImagePaths,
    PROPERTY_UPLOAD_DIR
};
