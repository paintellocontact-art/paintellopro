const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
 images: [{ type: String }],  
  image: {
    type: String,   // URL or file path
    default: '/images/default-product.png'
  },
  category: {
    type: String,
    enum: ['paint', 'tools', 'accessories', 'other'],
    default: 'paint'
  },
  featured: {
    type: Boolean,
    default: false   // for controlling which products appear on the home carousel
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
   // Video (full‑width player)
  videoFile: {
    type: String,           // URL of a video file (e.g. Cloudinary .mp4)
    default: ''
  },

  // YouTube tab
  videoId: {
    type: String,           // YouTube video ID (e.g. "dQw4w9WgXcQ")
    default: ''
  }
});

module.exports = mongoose.model('Product', productSchema);
