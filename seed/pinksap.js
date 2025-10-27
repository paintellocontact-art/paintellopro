var mongoose  = require('mongoose')
var pinksap = require('../models/pinksap')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var pinksaps = [
     {
        image: "https://live.staticflickr.com/65535/54483207460_1e36b3f486.jpg",
        title: "Paintello's Paint Washable Satinée - Brilliant White 4KG",
        price: 2800.00
    }
   
  
    
 
];

function seedpinksap(){
    pinksap.deleteMany({}, err => {
        if(err) console.log(err);
        pinksaps.forEach(seed => {
            pinksap.create(seed, (err, pinksap) => {
                if(err) console.log(err);
                pinksap.save();
            });
        });
    });
}

module.exports = seedpinksap;
