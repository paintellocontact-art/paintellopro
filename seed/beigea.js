var mongoose  = require('mongoose')
var beigea = require('../models/beigea')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigeas = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigea(){
    beigea.remove({}, err => {
        if(err) console.log(err);
        beigeas.forEach(seed => {
          beigea.create(seed, (err, beigea) => {
                if(err) console.log(err);
                beigea.save();
            });
        });
    });
}

module.exports = seedbeigea;
