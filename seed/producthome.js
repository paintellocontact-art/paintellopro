// seeds/productSeed.js
const mongoose = require('mongoose');
const Producthome = require('../models/producthome');

mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleProducthomes = [
  {
    title: 'Elegant Matte Finish',
    price: 2500,
    image: [
      'https://live.staticflickr.com/65535/54483309257_4452b0ab9d.jpg/600x400?text=Slide+1',
      'https://live.staticflickr.com/65535/54483309257_4452b0ab9d.jpg/600x400?text=Slide+2',
      'https://live.staticflickr.com/65535/54483309257_4452b0ab9d.jpg/600x400?text=Slide+3'
    ],
    description: 'A premium matte paint suitable for any interior.',
    details: {
      Finish: 'Matte',
      Coverage: '12m² per liter',
      Application: 'Brush or roller',
      Drying: '2 hours'
    },
    type: 'product'
  }
];

Producthome.insertMany(sampleProducthomes)
  .then(() => {
    console.log('✅ Sample products inserted');
    mongoose.connection.close();
  })
  .catch(err => console.log('❌ Seeding error', err));
