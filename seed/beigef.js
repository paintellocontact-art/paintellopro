var mongoose  = require('mongoose')
var beigef = require('../models/beigef')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigefs = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigef(){
    beigef.remove({}, err => {
        if(err) console.log(err);
        beigefs.forEach(seed => {
          beigef.create(seed, (err, beigef) => {
                if(err) console.log(err);
                beigef.save();
            });
        });
    });
}

module.exports = seedbeigef;
