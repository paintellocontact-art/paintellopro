var mongoose  = require('mongoose')
var greend = require('../models/greend')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greends = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedgreend(){
    greend.remove({}, err => {
        if(err) console.log(err);
        greends.forEach(seed => {
          greend.create(seed, (err, greend) => {
                if(err) console.log(err);
                greend.save();
            });
        });
    });
}

module.exports = seedgreend;
