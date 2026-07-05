const mongoose = require('mongoose');

const productOrderSchema = new mongoose.Schema({
  // Who ordered
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Guest info (if not logged in)
  guest: {
    firstName: String,
    lastName: String,
    numero: String,
    address: String,
    city: String,
    commune: String
  },

  // Cart snapshot
  cart: {
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        name: String,
        price: Number,
        image: String,
        qty: Number
      }
    ],
    totalQty: Number,
    totalPrice: Number
  },

  // Shipping
  shippingFee: { type: Number, default: 0 },
  deliveryDelay: String,
  totalWithShipping: Number,

  // Payment
  paymentMethod: {
    type: String,
    enum: ['cod', 'chargily'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },

  // Meta for Pixel
  metaUserData: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

module.exports = mongoose.model('ProductOrder', productOrderSchema);
