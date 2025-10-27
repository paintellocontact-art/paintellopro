var mongoose = require("mongoose");

var cuisinSchema = new mongoose.Schema({
    image: {type: String, required: true},
    title: {type: String, required: true},
    href: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model("cuisin", cuisinSchema);
