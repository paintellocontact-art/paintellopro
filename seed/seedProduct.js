// seedProduct.js – run with: node seedProduct.js
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Product.create({
      name: 'دهان بريميوم أبيض',
      description: 'دهان عالي الجودة للجدران الداخلية',
      price: 1200,
      image: 'https://live.staticflickr.com/65535/54921881174_01b777ecec_w.jpg',   // use any valid image URL
      category: 'paint',
      featured: true
    });
    console.log('Product added');
    process.exit();
  });
