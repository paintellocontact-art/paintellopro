
var mongoose  = require('mongoose')
var greyb = require('../models/greyb')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greybs = [
     {
        image: "https://live.staticflickr.com/65535/54484395216_e110327224.jpg",
        title: "Paintello's Paint Washable Satinée - Brilliant White 4KG",
        price: 2800.00
    }
   
  
    
 
];

function seedgreyb(){
    greyb.remove({}, err => {
        if(err) console.log(err);
        greybs.forEach(seed => {
            greyb.create(seed, (err, greyb) => {
                if(err) console.log(err);
                greyb.save();
            });
        });
    });
}

module.exports = seedgreyb;
