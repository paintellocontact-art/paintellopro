var mongoose  = require('mongoose')
var beiges = require('../models/beiges')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigess = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeiges(){
    beiges.remove({}, err => {
        if(err) console.log(err);
        beigess.forEach(seed => {
          beiges.create(seed, (err, beiges) => {
                if(err) console.log(err);
                beiges.save();
            });
        });
    });
}

module.exports = seedbeiges;
