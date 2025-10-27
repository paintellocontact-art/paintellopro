var mongoose  = require('mongoose')
var greyc = require('../models/greyc')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greycs = [
     {
        image: "https://live.staticflickr.com/65535/54484395216_e110327224.jpg",
        title: "Paintello's Paint Washable Satinée - Brilliant White 4KG",
        price: 2800.00
    }
   
  
    
 
];

function seedgreyc(){
    greyc.remove({}, err => {
        if(err) console.log(err);
        greycs.forEach(seed => {
            greyc.create(seed, (err, greyc) => {
                if(err) console.log(err);
                greyc.save();
            });
        });
    });
}

module.exports = seedgreyc;
