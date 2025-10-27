var mongoose  = require('mongoose')
var greene = require('../models/greene')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greenes = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedgreene(){
    greene.remove({}, err => {
        if(err) console.log(err);
        greenas.forEach(seed => {
          greene.create(seed, (err, greene) => {
                if(err) console.log(err);
                greene.save();
            });
        });
    });
}

module.exports = seedgreene;
