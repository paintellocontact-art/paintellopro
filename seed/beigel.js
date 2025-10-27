var mongoose  = require('mongoose')
var beigel = require('../models/beigel')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigels = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigel(){
    beigel.remove({}, err => {
        if(err) console.log(err);
        beigels.forEach(seed => {
          beigel.create(seed, (err, beigel) => {
                if(err) console.log(err);
                beigel.save();
            });
        });
    });
}

module.exports = seedbeigel;
