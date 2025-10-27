var mongoose  = require('mongoose')
var beigeo = require('../models/beigeo')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigeos = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigeo(){
    beigeo.remove({}, err => {
        if(err) console.log(err);
        beigeos.forEach(seed => {
          beigeo.create(seed, (err, beigeo) => {
                if(err) console.log(err);
                beigeo.save();
            });
        });
    });
}

module.exports = seedbeigeo;
