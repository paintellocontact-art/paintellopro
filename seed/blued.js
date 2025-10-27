var mongoose  = require('mongoose')
var blued = require('../models/blued')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var blueds = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedblued(){
    blued.remove({}, err => {
        if(err) console.log(err);
        blueds.forEach(seed => {
          blued.create(seed, (err, blued) => {
                if(err) console.log(err);
                blued.save();
            });
        });
    });
}

module.exports = seedblued;
