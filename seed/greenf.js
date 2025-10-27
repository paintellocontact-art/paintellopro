var mongoose  = require('mongoose')
var greenf = require('../models/greenf')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greenfs = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedgreenf(){
    greenf.remove({}, err => {
        if(err) console.log(err);
        greenfs.forEach(seed => {
          greenf.create(seed, (err, greenf) => {
                if(err) console.log(err);
                greenf.save();
            });
        });
    });
}

module.exports = seedgreenf;
