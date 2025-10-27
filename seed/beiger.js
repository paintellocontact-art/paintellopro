var mongoose  = require('mongoose')
var beiger = require('../models/beiger')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigers = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeiger(){
    beiger.remove({}, err => {
        if(err) console.log(err);
        beigers.forEach(seed => {
          beiger.create(seed, (err, beiger) => {
                if(err) console.log(err);
                beiger.save();
            });
        });
    });
}

module.exports = seedbeiger;
