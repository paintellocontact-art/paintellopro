var mongoose  = require('mongoose')
var blueb = require('../models/blueb')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var bluebs = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedblueb(){
    blueb.remove({}, err => {
        if(err) console.log(err);
        bluebs.forEach(seed => {
          blueb.create(seed, (err, blueb) => {
                if(err) console.log(err);
                blueb.save();
            });
        });
    });
}

module.exports = seedblueb;
