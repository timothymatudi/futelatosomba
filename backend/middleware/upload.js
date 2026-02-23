// Image upload middleware using Multer (memory) + Vercel Blob for storage
const multer = require('multer');
const path = require('path');
const { put, del } = require('@vercel/blob');

// Try to load Sharp, but make it optional for environments where it's unavailable
let sharp = null;
try {
    sharp = require('sharp');
} catch (error) {
    console.warn('Sharp module not available. Image processing will be disabled.');
    console.warn('Images will be stored as-is without resizing.');
}

// Configure storage for memory storage (we'll process with sharp then upload to Blob)
const storage = multer.memoryStorage();

// File filter for images only
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
        files: 20 // Max 20 files per upload
    },
    fileFilter: imageFilter
});

// Process image buffer with Sharp (or return as-is)
const processBuffer = async (buffer, type = 'property') => {
    if (!sharp) return buffer;

    try {
        if (type === 'avatar') {
            return await sharp(buffer)
                .resize(300, 300, { fit: 'cover', position: 'center' })
                .jpeg({ quality: 90 })
                .toBuffer();
        } else {
            return await sharp(buffer)
                .resize(1200, null, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toBuffer();
        }
    } catch (error) {
        console.error('Sharp processing failed, using original buffer:', error.message);
        return buffer;
    }
};

// Generate thumbnail buffer with Sharp (or return null)
const generateThumbnailBuffer = async (buffer) => {
    if (!sharp) return null;

    try {
        return await sharp(buffer)
            .resize(400, 300, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 80 })
            .toBuffer();
    } catch (error) {
        console.error('Thumbnail generation failed:', error.message);
        return null;
    }
};

// Upload a buffer to Vercel Blob and return the public URL
const uploadToBlob = async (buffer, filename) => {
    const blob = await put(filename, buffer, { access: 'public' });
    return blob.url;
};

// Process and upload image to Vercel Blob
const processImage = async (buffer, filename, type = 'property') => {
    try {
        const processedBuffer = await processBuffer(buffer, type);
        const blobUrl = await uploadToBlob(processedBuffer, `${type === 'avatar' ? 'avatars' : 'properties'}/${filename}`);
        return blobUrl;
    } catch (error) {
        console.error('Error processing/uploading image:', error);
        throw new Error('Failed to process image');
    }
};

// Generate and upload thumbnail to Vercel Blob
const generateThumbnail = async (buffer, filename) => {
    try {
        const thumbBuffer = await generateThumbnailBuffer(buffer);
        if (thumbBuffer) {
            return await uploadToBlob(thumbBuffer, `properties/thumb_${filename}`);
        }
        // If no thumbnail could be generated, upload the original as thumbnail
        return await uploadToBlob(buffer, `properties/thumb_${filename}`);
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        return null;
    }
};

// Middleware to handle single property image upload
const uploadPropertyImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const filename = `property_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

        const imageUrl = await processImage(req.file.buffer, filename, 'property');
        const thumbnailUrl = await generateThumbnail(req.file.buffer, filename);

        req.processedImage = {
            image: imageUrl,
            thumbnail: thumbnailUrl
        };

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Middleware to handle multiple property images upload
const uploadPropertyImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            req.processedImages = [];
            return next();
        }

        const processedImages = [];

        for (const file of req.files) {
            const filename = `property_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

            const imageUrl = await processImage(file.buffer, filename, 'property');
            const thumbnailUrl = await generateThumbnail(file.buffer, filename);

            processedImages.push({
                image: imageUrl,
                thumbnail: thumbnailUrl
            });
        }

        req.processedImages = processedImages;
        next();
    } catch (error) {
        console.error('Error in uploadPropertyImages:', error);
        res.status(500).json({ error: error.message });
    }
};

// Middleware to handle user avatar upload
const uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No avatar file provided' });
        }

        const filename = `avatar_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const avatarUrl = await processImage(req.file.buffer, filename, 'avatar');

        req.processedAvatar = avatarUrl;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete image from Vercel Blob by its URL
const deleteImage = async (imageUrl) => {
    try {
        // Only delete Blob URLs (they contain vercel-storage.com or blob.vercel-storage.com)
        if (imageUrl && (imageUrl.includes('vercel-storage.com') || imageUrl.includes('blob.vercel'))) {
            await del(imageUrl);
        }
    } catch (error) {
        console.error('Error deleting image from Blob:', error);
    }
};

module.exports = {
    upload,
    processImage,
    generateThumbnail,
    uploadPropertyImage,
    uploadPropertyImages,
    uploadAvatar,
    deleteImage
};
