var mongoose  = require('mongoose')
var beigei = require('../models/beigei')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigeis = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigei(){
    beigei.remove({}, err => {
        if(err) console.log(err);
        beigeis.forEach(seed => {
          beigei.create(seed, (err, beigei) => {
                if(err) console.log(err);
                beigei.save();
            });
        });
    });
}

module.exports = seedbeigei;
