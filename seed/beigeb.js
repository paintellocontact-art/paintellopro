var mongoose  = require('mongoose')
var beigeb = require('../models/beigeb')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigebs = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeigeb(){
    beigeb.remove({}, err => {
        if(err) console.log(err);
        beigebs.forEach(seed => {
          beigeb.create(seed, (err, beigeb) => {
                if(err) console.log(err);
                beigeb.save();
            });
        });
    });
}

module.exports = seedbeigeb;
