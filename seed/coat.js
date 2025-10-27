var mongoose  = require('mongoose')
var coat = require('../models/coat')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var coats = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedcoat(){
    coat.remove({}, err => {
        if(err) console.log(err);
        coats.forEach(seed => {
          coat.create(seed, (err, coat) => {
                if(err) console.log(err);
                coat.save();
            });
        });
    });
}

module.exports = seedcoat;
