var mongoose  = require('mongoose')
var bluec = require('../models/bluec')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var bluecs = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbluec(){
    bluec.remove({}, err => {
        if(err) console.log(err);
        bluecs.forEach(seed => {
          bluec.create(seed, (err, bluec) => {
                if(err) console.log(err);
                bluec.save();
            });
        });
    });
}

module.exports = seedbluec;
