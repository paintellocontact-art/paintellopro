const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const painterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerSqm: {
    type: Number,
    required: true,
    min: 0
  },
  specialization: [{
    type: String,
    enum: ['interior', 'exterior', 'commercial', 'residential']
  }],
  location: {
    wilaya: String,
    wilayaNumber: Number,
    address: String
  },
  verification: {
    idCard: {
      publicId: String, // Cloudinary public_id
      url: String,      // Cloudinary URL
      uploadedAt: Date
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verifiedAt: Date,
    adminNotes: String
  },
 portfolio: [{
  title: String, // Optional: name of the project
  description: String,
  category: {
    type: String,
    enum: ['interior', 'exterior', 'commercial', 'residential'],
    default: 'interior'
  },
  projectSize: String,
  clientType: String,
  uploadedByAdmin: {
    type: Boolean,
    default: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  images: [{
    publicId: String, // Cloudinary public_id
    url: String,      // Cloudinary secure_url or any hosted image URL
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}],

  // PROFILE PICTURE FIELD - ADD THIS (MISSING FROM YOUR MODEL)
  profilePicture: {
    publicId: String,
    url: String,
    uploadedAt: Date
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  responseRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  activeJobs: {
    type: Number,
    default: 0
  },
  inProgressJobs: {
    type: Number,
    default: 0
  },
  pendingJobs: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  monthlyEarnings: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    maxlength: 500
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'unavailable'],
    default: 'available'
  },
  availabilitySchedule: {
    scheduleType: {
      type: String,
      enum: ['flexible', 'fixed'],
      default: 'flexible'
    },
    workingDays: [String],
    workingHours: String,
    maxJobsPerWeek: {
      type: Number,
      default: 3
    },
    updatedAt: Date
  },
  busyPeriods: [{
    startDate: Date,
    endDate: Date,
    reason: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  availabilityNotes: String,
  availableFrom: Date,
  website: String,
  facebook: String,
  instagram: String,
  businessName: String,
  teamSize: {
    type: Number,
    default: 1,
    min: 1
  },
  serviceAreas: [{
    wilaya: String,
    wilayaNumber: Number
  }],
  userType: {
    type: String,
    default: 'painter'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: String
}, {
  timestamps: true
});
// 🔒 Hash password before saving
painterSchema.pre('save', async function (next) {
  try {
    // Only hash if password is new or modified
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Keep all your existing methods and virtuals...
painterSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

painterSchema.virtual('verificationStatus').get(function() {
  return this.verification.status.charAt(0).toUpperCase() + 
         this.verification.status.slice(1);
});

painterSchema.virtual('isVerified').get(function() {
  return this.verification.status === 'verified';
});

painterSchema.virtual('fullAddress').get(function() {
  if (this.location.address && this.location.wilaya) {
    return `${this.location.address}, ${this.location.wilaya}`;
  }
  return this.location.wilaya || 'Address not specified';
});

painterSchema.virtual('experienceLevel').get(function() {
  if (this.experience >= 10) return 'Expert';
  if (this.experience >= 5) return 'Experienced';
  if (this.experience >= 2) return 'Intermediate';
  return 'Beginner';
});

painterSchema.virtual('ratingStars').get(function() {
  return '★'.repeat(Math.floor(this.rating)) + '☆'.repeat(5 - Math.floor(this.rating));
});

painterSchema.methods.updatePerformanceMetrics = async function() {
  const Order = mongoose.model('Order');
  
  const totalJobs = await Order.countDocuments({ 'painter.id': this._id });
  const completedJobs = await Order.countDocuments({ 
    'painter.id': this._id, 
    status: 'completed' 
  });
  const respondedJobs = await Order.countDocuments({
    'painter.id': this._id,
    'painter.respondedAt': { $exists: true }
  });
  
  this.completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
  this.responseRate = totalJobs > 0 ? Math.round((respondedJobs / totalJobs) * 100) : 0;
  
  this.activeJobs = await Order.countDocuments({
    'painter.id': this._id,
    status: { $in: ['pending', 'accepted', 'in_progress'] }
  });
  
  this.inProgressJobs = await Order.countDocuments({
    'painter.id': this._id,
    status: 'in_progress'
  });
  
  this.pendingJobs = await Order.countDocuments({
    'painter.id': this._id,
    status: 'pending'
  });
  
  this.completedJobs = completedJobs;
  
  await this.save();
};

painterSchema.methods.calculateMonthlyEarnings = async function() {
  const Order = mongoose.model('Order');
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const monthlyOrders = await Order.find({
    'painter.id': this._id,
    status: 'completed',
    updatedAt: { $gte: thirtyDaysAgo }
  });
  
  this.monthlyEarnings = monthlyOrders.reduce((total, order) => {
    return total + (order.totalAmount || 0);
  }, 0);
  
  await this.save();
};

painterSchema.methods.addLoyaltyPoints = async function(points, reason) {
  this.loyaltyPoints += points;
  await this.save();
  console.log(`Added ${points} loyalty points to ${this.name} for: ${reason}`);
};

painterSchema.statics.findByWilaya = function(wilayaNumber) {
  return this.find({
    'location.wilayaNumber': wilayaNumber,
    'verification.status': 'verified',
    'isActive': true,
    'availability': 'available'
  }).sort({ rating: -1, completedJobs: -1 });
};

painterSchema.set('toJSON', { virtuals: true });
painterSchema.set('toObject', { virtuals: true });

painterSchema.index({ 'location.wilayaNumber': 1, 'verification.status': 1 });
painterSchema.index({ rating: -1 });
painterSchema.index({ 'specialization': 1 });

module.exports = mongoose.model('Painter', painterSchema);
