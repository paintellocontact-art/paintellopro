var mongoose  = require('mongoose')
var beigeh = require('../models/beigeh')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigehs = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigeh(){
    beigeh.remove({}, err => {
        if(err) console.log(err);
        beigehs.forEach(seed => {
          beigeh.create(seed, (err, beigeh) => {
                if(err) console.log(err);
                beigeh.save();
            });
        });
    });
}

module.exports = seedbeigeh;
