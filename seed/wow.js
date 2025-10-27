var mongoose  = require('mongoose')
var wow = require('../models/wow')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })
var wows = [
    {
        image: "https://live.staticflickr.com/65535/54484923974_c91b3fedd5.jpg",
        title: "Paintello's Tile Paint BLACK 1KG + Mini Rouleaux offret ",
        price: 3650
    },
    {
        image: "https://live.staticflickr.com/65535/54485082775_b762fc787d.jpg",
        title: "Paintello's Tile Paint white 1KG  + Mini Rouleaux offret",
        price: 3500
    }
];


function seedwow(){
    wow.deleteMany({}, err => {
        if(err) console.log(err);
        wows.forEach(seed => {
            wow.create(seed, (err, wow) => {
                if(err) console.log(err);
                wow.save();
            });
        });
    });
}

module.exports = seedwow;
