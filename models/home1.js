var mongoose = require("mongoose");

var home1Schema = new mongoose.Schema({
    image: {type: String, required: true},
    title: {type: String, required: true}
});

module.exports = mongoose.model("home1", home1Schema);