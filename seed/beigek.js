var mongoose  = require('mongoose')
var beigek = require('../models/beigek')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigeks = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigek(){
    beigek.remove({}, err => {
        if(err) console.log(err);
        beigeks.forEach(seed => {
          beigek.create(seed, (err, beigek) => {
                if(err) console.log(err);
                beigek.save();
            });
        });
    });
}

module.exports = seedbeigek;
