var mongoose = require("mongoose");

var shippingSchema = new mongoose.Schema({
    wilaya: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model("shipping", shippingSchema);