var mongoose  = require('mongoose')
var greye = require('../models/greye')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greyes = [
     {
        image: "https://live.staticflickr.com/65535/54484395216_e110327224.jpg",
        title: "Paintello's Paint Washable Satinée - Brilliant White 4KG",
        price: 2800.00
    }
   
  
    
 
];

function seedgreye(){
    greye.remove({}, err => {
        if(err) console.log(err);
        greyes.forEach(seed => {
            greye.create(seed, (err, greye) => {
                if(err) console.log(err);
                greye.save();
            });
        });
    });
}

module.exports = seedgreye;
