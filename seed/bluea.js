var mongoose  = require('mongoose')
var bluea = require('../models/bluea')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var blueas = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbluea(){
    bluea.remove({}, err => {
        if(err) console.log(err);
        blueas.forEach(seed => {
          bluea.create(seed, (err, bluea) => {
                if(err) console.log(err);
                bluea.save();
            });
        });
    });
}

module.exports = seedbluea;
