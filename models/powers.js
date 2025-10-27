const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const powersSchema = new Schema({
  chambre: {type: String, required: true},
  help: {type: String, required: true},
  etat: {type: String, required: true},
  owner: {type: String, required: true},
  time: {type: String, required: true},
  etape: {type: String, required: true},
  budge: {type: String, required: true},
  contactemail: {type: String, required: true},
  contactnum : {type: Number, required: true}

});

module.exports = mongoose.model('Powers', powersSchema);
