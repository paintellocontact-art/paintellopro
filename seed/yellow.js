var mongoose  = require('mongoose')
var yellow = require('../models/yellow')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var yellows = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedyellow(){
    yellow.deleteMany({}, err => {
        if(err) console.log(err);
        yellows.forEach(seed => {
          yellow.create(seed, (err, yellow) => {
                if(err) console.log(err);
                yellow.save();
            });
        });
    });
}

module.exports = seedyellow;
