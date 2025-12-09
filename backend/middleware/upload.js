// Image upload middleware using Multer and Sharp for processing
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Try to load Sharp, but make it optional for Android/Termux environments
let sharp = null;
try {
    sharp = require('sharp');
} catch (error) {
    console.warn('Sharp module not available. Image processing will be disabled.');
    console.warn('Images will be stored as-is without resizing.');
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
const propertyImagesDir = path.join(uploadsDir, 'properties');
const userAvatarsDir = path.join(uploadsDir, 'avatars');

[uploadsDir, propertyImagesDir, userAvatarsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure storage for memory storage (we'll process with sharp)
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

// Process and save image with Sharp (or just save if Sharp unavailable)
const processImage = async (buffer, filename, type = 'property') => {
    try {
        const outputDir = type === 'avatar' ? userAvatarsDir : propertyImagesDir;
        const outputPath = path.join(outputDir, filename);

        if (sharp) {
            // Different processing based on type
            if (type === 'avatar') {
                // Avatar: resize to square, 300x300
                await sharp(buffer)
                    .resize(300, 300, {
                        fit: 'cover',
                        position: 'center'
                    })
                    .jpeg({ quality: 90 })
                    .toFile(outputPath);
            } else {
                // Property image: resize to max 1200px width, maintain aspect ratio
                await sharp(buffer)
                    .resize(1200, null, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .jpeg({ quality: 85 })
                    .toFile(outputPath);
            }
        } else {
            // Sharp not available, just save the file as-is
            fs.writeFileSync(outputPath, buffer);
        }

        // Return relative path for storage in database
        return `/uploads/${type === 'avatar' ? 'avatars' : 'properties'}/${filename}`;
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
    }
};

// Generate thumbnail (or return original if Sharp unavailable)
const generateThumbnail = async (buffer, filename) => {
    try {
        if (sharp) {
            const thumbnailPath = path.join(propertyImagesDir, `thumb_${filename}`);

            await sharp(buffer)
                .resize(400, 300, {
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({ quality: 80 })
                .toFile(thumbnailPath);

            return `/uploads/properties/thumb_${filename}`;
        } else {
            // No Sharp, return original image path
            return `/uploads/properties/${filename}`;
        }
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        // If thumbnail generation fails, return original
        return `/uploads/properties/${filename}`;
    }
};

// Middleware to handle single property image upload
const uploadPropertyImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const filename = `property_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

        // Process image
        const imagePath = await processImage(req.file.buffer, filename, 'property');
        const thumbnailPath = await generateThumbnail(req.file.buffer, filename);

        // Add paths to request
        req.processedImage = {
            image: imagePath,
            thumbnail: thumbnailPath
        };

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Middleware to handle multiple property images upload
const uploadPropertyImages = async (req, res, next) => {
    try {
        // If no files uploaded, skip processing (images are optional in some cases)
        if (!req.files || req.files.length === 0) {
            req.processedImages = [];
            return next();
        }

        const processedImages = [];

        // Process each image
        for (const file of req.files) {
            const filename = `property_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

            const imagePath = await processImage(file.buffer, filename, 'property');
            const thumbnailPath = await generateThumbnail(file.buffer, filename);

            processedImages.push({
                image: imagePath,
                thumbnail: thumbnailPath
            });
        }

        // Add processed images to request
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

        // Process avatar
        const avatarPath = await processImage(req.file.buffer, filename, 'avatar');

        // Add path to request
        req.processedAvatar = avatarPath;

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete image file
const deleteImage = (imagePath) => {
    try {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (error) {
        console.error('Error deleting image:', error);
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
