const mongoose = require('mongoose');

const painterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  specialization: [{
    type: String,
    enum: ['interior', 'exterior', 'commercial', 'residential', 'decorative']
  }],
  wilaya: {
    type: String,
    required: true
  },
  wilayaNumber: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  pricePerSqm: {
    type: Number,
    required: true,
    min: 0
  },
  bio: {
    type: String,
    maxlength: 500
  },
  portfolio: [{
    image: String,
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalJobs: {
    type: Number,
    default: 0
  },
  verification: {
    idCard: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  commissionRate: {
    type: Number,
    default: 0.10
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Painter', painterSchema);
