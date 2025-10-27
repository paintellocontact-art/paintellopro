const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  cart: {type: Object, required: true},
  address: {type: String, required: true},
  name: {type: String, required: true},
  city: {type: String, required: true},
  country: {type: String, required: true},
  
  numero : {type: Number, required: true},
   returnRequest: { 
    type: Schema.Types.ObjectId, 
    ref: 'ReturnRequest' 
  },
  shippingFee: { type: Number, default: 0 },
  deliveryDelay: { type: String },
  totalWithShipping: { type: Number }
}, { timestamps: true }); // Adding timestamps for created/updated dates



module.exports = mongoose.model('Order', orderSchema);
