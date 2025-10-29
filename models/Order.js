const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // For registered users
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.source === 'user'; }
  },
  
  // For guest users (non-registered)
  guestClient: {
    name: {
      type: String,
      required: function() { return this.source === 'guest'; }
    },
    email: {
      type: String,
      required: function() { return this.source === 'guest'; }
    },
    phone: {
      type: String,
      required: function() { return this.source === 'guest'; }
    }
  },
  
  // Painter reference
  painter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Painter',
    required: true
  },
  
  // Service details
  serviceType: {
    type: String,
    required: true,
    enum: ['interior', 'exterior', 'commercial', 'residential']
  },
  
  // Location details
  wilaya: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  area: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Order details
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Financials
  commission: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Dates
  scheduledDate: Date,
  completedAt: Date,
  preferredDate: Date,
  
  // Order source
  source: {
    type: String,
    enum: ['user', 'guest'],
    default: 'user'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
