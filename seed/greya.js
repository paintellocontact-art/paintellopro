var mongoose  = require('mongoose')
var greya = require('../models/greya')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greyas = [
     {
        image: "https://live.staticflickr.com/65535/54484395216_e110327224.jpg",
        title: "Paintello's Paint Washable Satinée - Brilliant White 4KG",
        price: 2800.00
    }
   
  
    
 
];

function seedgreya(){
    greya.remove({}, err => {
        if(err) console.log(err);
        greyas.forEach(seed => {
            greya.create(seed, (err, greya) => {
                if(err) console.log(err);
                greya.save();
            });
        });
    });
}

module.exports = seedgreya;
