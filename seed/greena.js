var mongoose  = require('mongoose')
var greena = require('../models/greena')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greenas = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedgreena(){
    greena.remove({}, err => {
        if(err) console.log(err);
        greenas.forEach(seed => {
          greena.create(seed, (err, greena) => {
                if(err) console.log(err);
                greena.save();
            });
        });
    });
}

module.exports = seedgreena;
