// seeds/productSeed.js
const mongoose = require('mongoose');
const Yelloow = require('../models/yelloow');

mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleYelloows = [
  {
    title: 'Paintello Paint BLUEDROP 756P',
    price: 3300,
    image: [
      'https://live.staticflickr.com/65535/54481135987_b23529b174.jpg/600x400?text=Slide+1',
      'https://live.staticflickr.com/65535/54482263698_bd2c6cb990.jpg/600x400?text=Slide+2',
      'https://live.staticflickr.com/65535/54482180424_c40a046803.jpg/600x400?text=Slide+3'
    ],
    description: 'Lémulsion mate lavable de Paintello est une peinture dintérieur résistante et durable, ce qui signifie que les marques et les déversements quotidiens peuvent facilement être essuyés sans gâcher la finition. La formulation à base deau et à faible odeur sèche également rapidement Washable Matt est idéal pour peindre les zones très fréquentées de votre maison ',
    details: {
      Finish: 'Matte',
      Coverage: '12m² per liter',
      Application: 'Brush or roller',
      Drying: '2 hours'
    },
    type: 'product'
  },
   {
    title: 'Paintello Paint COOLMORA 744P',
    price: 3300,
    image: [
      'https://live.staticflickr.com/65535/54482180389_5e8774ddf9.jpg/600x400?text=Slide+1',
      "https://live.staticflickr.com/65535/54482345360_b16475ac19.jpg/600x400?text=Slide+2',
      'https://live.staticflickr.com/65535/54481135927_20bcef4cdc.jpg/600x400?text=Slide+3'
    ],
    description: 'Lémulsion mate lavable de Paintello est une peinture dintérieur résistante et durable, ce qui signifie que les marques et les déversements quotidiens peuvent facilement être essuyés sans gâcher la finition. La formulation à base deau et à faible odeur sèche également rapidement Washable Matt est idéal pour peindre les zones très fréquentées de votre maison ',
    details: {
      Finish: 'Matte',
      Coverage: '12m² per liter',
      Application: 'Brush or roller',
      Drying: '2 hours'
    },
    type: 'product'
  },
   {
    title: 'Paintello Paint FRESHOBLUE 742P',
    price: 3300,
    image: [
      'https://live.staticflickr.com/65535/54482263638_167c17c6e5.jpg/600x400?text=Slide+1',
      "https://live.staticflickr.com/65535/54482263628_ae61e76122.jpg/600x400?text=Slide+2',
      'https://live.staticflickr.com/65535/54481979731_11388dc9aa.jpg/600x400?text=Slide+3'
    ],
    description: 'Lémulsion mate lavable de Paintello est une peinture dintérieur résistante et durable, ce qui signifie que les marques et les déversements quotidiens peuvent facilement être essuyés sans gâcher la finition. La formulation à base deau et à faible odeur sèche également rapidement Washable Matt est idéal pour peindre les zones très fréquentées de votre maison ',
    details: {
      Finish: 'Matte',
      Coverage: '12m² per liter',
      Application: 'Brush or roller',
      Drying: '2 hours'
    },
    type: 'product'
  },
   {
    title: 'Paintello Paint TWEEDIA 752P',
    price: 3300,
    image: [
      'https://live.staticflickr.com/65535/54481135862_0261d66c2a.jpg/600x400?text=Slide+1',
      "https://live.staticflickr.com/65535/54482180334_5ff5296470.jpg/600x400?text=Slide+2',
      'https://live.staticflickr.com/65535/54481979716_84811b6ce5.jpg/600x400?text=Slide+3'
    ],
    description: 'Lémulsion mate lavable de Paintello est une peinture dintérieur résistante et durable, ce qui signifie que les marques et les déversements quotidiens peuvent facilement être essuyés sans gâcher la finition. La formulation à base deau et à faible odeur sèche également rapidement Washable Matt est idéal pour peindre les zones très fréquentées de votre maison ',
    details: {
      Finish: 'Matte',
      Coverage: '12m² per liter',
      Application: 'Brush or roller',
      Drying: '2 hours'
    },
    type: 'product'
  }
];

yelloow.insertMany(sampleYelloows)
  .then(() => {
    console.log('✅ Sample products inserted');
    mongoose.connection.close();
  })
  .catch(err => console.log('❌ Seeding error', err));
