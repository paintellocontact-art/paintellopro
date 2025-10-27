var mongoose = require("mongoose");

var satinSchema = new mongoose.Schema({
    image: {type: String, required: true},
    title: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model("satin", satinSchema);