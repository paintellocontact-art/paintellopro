// models/product.js
const mongoose = require('mongoose');

const producthomeSchema = new mongoose.Schema({
  title: String,
  price: Number,
  oldPrice: {          // 👈 add this field for promo
    type: Number,
    default: null
  },
  image: [String],         // For image slider
  description: String,     // Description tab
  details: Object,         // Info tab
  type: String,            // Optional: used for add-to-cart route logic
  videoId: String,         // Store YouTube video ID here
  // Add 3D model support
  stlFile: {
    type: String,
    default: null
  },
  // Optional: Additional 3D model settings
  model3D: {
    enabled: {
      type: Boolean,
      default: false
    },
    // You can add more 3D-specific settings here if needed
    autoRotate: {
      type: Boolean,
      default: true
    },
    defaultColor: {
      type: String
    }
  }
}, {
  timestamps: true // Optional: adds createdAt and updatedAt fields
});

// Virtual property to check if product has 3D model
producthomeSchema.virtual('has3DModel').get(function() {
  return !!this.stlFile;
});

module.exports = mongoose.model('Producthome', producthomeSchema);
