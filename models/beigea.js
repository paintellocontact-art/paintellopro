var mongoose = require("mongoose");

var beigeaSchema = new mongoose.Schema({
    image: {type: String, required: true},
    title: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model("beigea", beigeaSchema);
