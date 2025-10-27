var mongoose = require("mongoose");

var homeSchema = new mongoose.Schema({
    image: {type: String, required: true},
    title: {type: String, required: true}
});

module.exports = mongoose.model("home", homeSchema);