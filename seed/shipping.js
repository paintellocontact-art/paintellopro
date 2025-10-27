var mongoose  = require('mongoose')
var shipping = require('../models/shipping')

mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var shippings = [
    {
        wilaya: "Alger",
        price: 400
    },
  {
        wilaya: "Oran",
        price: 600
    },
  {
        wilaya: "Constantine",
        price: 700
    },
  {
        wilaya: "Blida",
        price: 400
    }
  
];

function seedshipping(){
    shipping.deleteMany({}, err => {
        if(err) console.log(err);
        shippings.forEach(seed => {
            shipping.create(seed, (err, shipping) => {
                if(err) console.log(err);
                shipping.save();
            });
        });
    });
}

module.exports = seedshipping;
