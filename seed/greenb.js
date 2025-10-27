
var mongoose  = require('mongoose')
var greenb = require('../models/greenb')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greenbs = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedgreenb(){
    greenb.remove({}, err => {
        if(err) console.log(err);
        greenbs.forEach(seed => {
          greenb.create(seed, (err, greenb) => {
                if(err) console.log(err);
                greenb.save();
            });
        });
    });
}

module.exports = seedgreenb;
