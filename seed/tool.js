var mongoose  = require('mongoose')
var tool = require('../models/tool')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var tools = [
   {
        image: "https://s9.gifyu.com/images/SV82T.png",
        title: "Paintello's Sample ",
        price: 150.00
    }
  
 
];

function seedtool(){
    tool.deleteMany({}, err => {
        if(err) console.log(err);
        tools.forEach(seed => {
            tool.create(seed, (err, tool) => {
                if(err) console.log(err);
                tool.save();
            });
        });
    });
}

module.exports = seedtool;
