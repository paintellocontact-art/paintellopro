var mongoose  = require('mongoose')
var beigee = require('../models/beigee')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigees = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigee(){
    beigee.remove({}, err => {
        if(err) console.log(err);
        beigees.forEach(seed => {
          beigee.create(seed, (err, beigee) => {
                if(err) console.log(err);
                beigee.save();
            });
        });
    });
}

module.exports = seedbeigee;
