var mongoose = require("mongoose");

var dealSchema = new mongoose.Schema({
    image: {type: String, required: true},
    href: {type: String, required: false}
    
});

module.exports = mongoose.model("deal", dealSchema);