var mongoose  = require('mongoose')
var sample = require('../models/sample')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var samples = [
   {
        image: "https://s9.gifyu.com/images/SV82T.png",
        title: "Paintello's Sample ",
        price: 150.00
    }
  
 
];

function seedsample(){
    sample.deleteMany({}, err => {
        if(err) console.log(err);
        samples.forEach(seed => {
            sample.create(seed, (err, sample) => {
                if(err) console.log(err);
                sample.save();
            });
        });
    });
}

module.exports = seedsample;
