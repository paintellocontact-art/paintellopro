var mongoose  = require('mongoose')
var beiget = require('../models/beiget')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var beigets = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedbeiget(){
    beiget.remove({}, err => {
        if(err) console.log(err);
        beigets.forEach(seed => {
          beiget.create(seed, (err, beiget) => {
                if(err) console.log(err);
                beiget.save();
            });
        });
    });
}

module.exports = seedbeiget;
