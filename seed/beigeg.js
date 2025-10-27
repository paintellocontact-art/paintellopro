var mongoose  = require('mongoose')
var beigeg = require('../models/beigeg')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigegs = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigeg(){
    beigeg.remove({}, err => {
        if(err) console.log(err);
        beigegs.forEach(seed => {
          beigeg.create(seed, (err, beigeg) => {
                if(err) console.log(err);
                beigeg.save();
            });
        });
    });
}

module.exports = seedbeigeg;
