const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ds5biqvns',
  api_key: process.env.CLOUDINARY_API_KEY || '236572545687835',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'SrO-u58-jXBthHGbyq6m8LPI1V4'
});

// Configure storage for ID cards only
const idCardStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'paintello/id-cards',
    format: async (req, file) => 'png', // Convert all to png to save space
    transformation: [
      { width: 800, height: 600, crop: 'limit' }, // Resize to save storage
      { quality: 'auto:good' } // Optimize quality
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      return `idcard_${timestamp}_${randomString}`;
    }
  },
});

// File filter for ID cards only (accepts images)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'idCard' && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for ID cards'), false);
  }
};

// Configure multer with limits
const uploadIdCard = multer({
  storage: idCardStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for ID cards
    files: 1 // Only one file for ID card
  }
});

// Utility function to delete image from Cloudinary (if needed)
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Utility function to get secure URL
const getOptimizedUrl = (publicId) => {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { width: 400, height: 300, crop: 'limit' },
      { quality: 'auto:good' }
    ]
  });
};

module.exports = {
  cloudinary,
  uploadIdCard,
  deleteFromCloudinary,
  getOptimizedUrl
};
