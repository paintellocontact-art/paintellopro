var mongoose  = require('mongoose')
var beigem = require('../models/beigem')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigems = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigem(){
    beigem.remove({}, err => {
        if(err) console.log(err);
        beigems.forEach(seed => {
          beigem.create(seed, (err, beigem) => {
                if(err) console.log(err);
                beigem.save();
            });
        });
    });
}

module.exports = seedbeigem;
