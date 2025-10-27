var mongoose  = require('mongoose')
var greyf = require('../models/greyf')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greyfs = [
     {
        image: "https://live.staticflickr.com/65535/54484395216_e110327224.jpg",
        title: "Paintello's Paint Washable Satinée - Brilliant White 4KG",
        price: 2800.00
    }
   
  
    
 
];

function seedgreyf(){
    greyf.remove({}, err => {
        if(err) console.log(err);
        greyfs.forEach(seed => {
            greyf.create(seed, (err, greyf) => {
                if(err) console.log(err);
                greyf.save();
            });
        });
    });
}

module.exports = seedgreyf;
