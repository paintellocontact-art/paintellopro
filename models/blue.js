// models/product.js
const mongoose = require('mongoose');

const blueSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: [String],         // For image slider
  description: String,      // Description tab
  details: Object,          // Info tab
  type: String              // Optional: used for add-to-cart route logic
});

module.exports = mongoose.model('Blue', blueSchema);
