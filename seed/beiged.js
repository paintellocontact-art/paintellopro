var mongoose  = require('mongoose')
var beiged = require('../models/beiged')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigeds = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeiged(){
    beiged.remove({}, err => {
        if(err) console.log(err);
        beigeds.forEach(seed => {
          beiged.create(seed, (err, beiged) => {
                if(err) console.log(err);
                beiged.save();
            });
        });
    });
}

module.exports = seedbeiged;
