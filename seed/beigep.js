var mongoose  = require('mongoose')
var beigep = require('../models/beigep')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigeps = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigep(){
    beigep.remove({}, err => {
        if(err) console.log(err);
        beigeps.forEach(seed => {
          beigep.create(seed, (err, beigep) => {
                if(err) console.log(err);
                beigep.save();
            });
        });
    });
}

module.exports = seedbeigep;
