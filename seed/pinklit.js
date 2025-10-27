var mongoose  = require('mongoose')
var pinklit = require('../models/pinklit')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var pinklits = [
     {
        image: "https://live.staticflickr.com/65535/54483207460_1e36b3f486.jpg",
        title: "Paintello's Paint Washable Satinée - Brilliant White 4KG",
        price: 2800.00
    }
   
  
    
 
];

function seedpinklit(){
    pinklit.deleteMany({}, err => {
        if(err) console.log(err);
        pinklits.forEach(seed => {
            pinklit.create(seed, (err, pinklit) => {
                if(err) console.log(err);
                pinklit.save();
            });
        });
    });
}

module.exports = seedpinklit;
