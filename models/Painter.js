const mongoose = require('mongoose');

const painterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  skills: [String], // e.g. ["interior", "exterior", "decorative"]
  portfolio: [String], // image URLs or file paths
  availability: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviews: [{ client: String, comment: String, stars: Number }]
}, { timestamps: true });

module.exports = mongoose.model('Painter', painterSchema);
