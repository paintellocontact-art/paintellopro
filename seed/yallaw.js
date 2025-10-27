var mongoose  = require('mongoose')
var yallaw = require('../models/yallaw')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var yallaws = [
     {
        image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
        title: "Paintello's MAC 4KG",
        price: 2390.00
    }
    
 
];

function seedyallaw(){
    yallaw.deleteMany({}, err => {
        if(err) console.log(err);
        yallaws.forEach(seed => {
          yallaw.create(seed, (err, yallaw) => {
                if(err) console.log(err);
                yallaw.save();
            });
        });
    });
}

module.exports = seedyallaw;
