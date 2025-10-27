const mongoose = require('mongoose');
const Paintello = require('../models/paintello');

mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const paintellos = [

  {
    title: "Decorative Vase",
    price: 2500,
    image:  [
      'https://live.staticflickr.com/65535/54483309257_4452b0ab9d.jpg/600x400?text=Slide+1',
      'https://live.staticflickr.com/65535/54483309257_4452b0ab9d.jpg/600x400?text=Slide+2',
      'https://live.staticflickr.com/65535/54483309257_4452b0ab9d.jpg/600x400?text=Slide+3'
    ],
  }
];

async function seedPaintellos() {
  try {
    await Paintello.deleteMany({});
    await Paintello.insertMany(paintellos);
    console.log("Home products seeded!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

seedPaintellos();
