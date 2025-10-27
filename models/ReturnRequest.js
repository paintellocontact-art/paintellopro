const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReturnRequestSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    numero: { type: String, required: true },
    reason: { type: String, required: true, enum: [
        'wrong_item', 'defective', 'not_as_described', 'changed_mind', 'other'
    ]},
    refundMethod: { type: String, required: true, enum: ['exchange', 'ccp_refund'] },
    exchangeItem: String,
    ccpNumber: String,
    notes: String,
    status: { 
        type: String, 
        required: true, 
        enum: ['pending', 'approved', 'rejected', 'processed'], 
        default: 'pending' 
    },
    processedAt: Date,
    adminNotes: String
}, { timestamps: true });

module.exports = mongoose.model('ReturnRequest', ReturnRequestSchema);
