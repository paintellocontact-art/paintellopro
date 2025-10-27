var mongoose  = require('mongoose')
var greyd = require('../models/greyd')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greyds = [
     {
        image: "https://live.staticflickr.com/65535/54484395216_e110327224.jpg",
        title: "Paintello's Paint Washable Satinée - Brilliant White 4KG",
        price: 2800.00
    }
   
  
    
 
];

function seedgreyd(){
    greyd.remove({}, err => {
        if(err) console.log(err);
        greyds.forEach(seed => {
            greyd.create(seed, (err, greyd) => {
                if(err) console.log(err);
                greyd.save();
            });
        });
    });
}

module.exports = seedgreyd;
