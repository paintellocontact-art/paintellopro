var mongoose  = require('mongoose')
var beigej = require('../models/beigej')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigejs = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigej(){
    beigej.remove({}, err => {
        if(err) console.log(err);
        beigejs.forEach(seed => {
          beigej.create(seed, (err, beigej) => {
                if(err) console.log(err);
                beigej.save();
            });
        });
    });
}

module.exports = seedbeigej;
