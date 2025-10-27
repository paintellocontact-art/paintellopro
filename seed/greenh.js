var mongoose  = require('mongoose')
var greenh = require('../models/greenh')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greenhs = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedgreenh(){
    greenh.remove({}, err => {
        if(err) console.log(err);
        greenhs.forEach(seed => {
          greenh.create(seed, (err, greenh) => {
                if(err) console.log(err);
                greenh.save();
            });
        });
    });
}

module.exports = seedgreenh;
