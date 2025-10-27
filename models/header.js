var mongoose = require("mongoose");

var headerSchema = new mongoose.Schema({
    image: {type: String, required: true},
    href: {type: String, required: false}
});

module.exports = mongoose.model("header", headerSchema);