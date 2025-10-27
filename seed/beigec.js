var mongoose  = require('mongoose')
var beigec = require('../models/beigec')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigecs = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigec(){
    beigec.remove({}, err => {
        if(err) console.log(err);
        beigecs.forEach(seed => {
          beigec.create(seed, (err, beigec) => {
                if(err) console.log(err);
                beigec.save();
            });
        });
    });
}

module.exports = seedbeigec;
