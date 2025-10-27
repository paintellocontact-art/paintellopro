var mongoose = require("mongoose");

var saleSchema = new mongoose.Schema({
    image: {type: String, required: true},
    title: {type: String, required: true}, 
    href: {type: String, required: false} 
});

module.exports = mongoose.model("sale", saleSchema);