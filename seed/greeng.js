var mongoose  = require('mongoose')
var greeng = require('../models/greeng')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var greengs = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedgreeng(){
    greeng.remove({}, err => {
        if(err) console.log(err);
        greengs.forEach(seed => {
          greeng.create(seed, (err, greeng) => {
                if(err) console.log(err);
                greeng.save();
            });
        });
    });
}

module.exports = seedgreeng;
