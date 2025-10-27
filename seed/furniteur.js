var mongoose  = require('mongoose')
var furniteur = require('../models/furniteur')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

var furniteurs = [
    {
        image: "https://live.staticflickr.com/65535/54484751175_41c6dd91d8.jpg",
        title: "Paintello Paint Vinyl Silk Emulsion - Brilliant White 4KG",
        price: 500.00
    },
   
    {
        image: "https://s3.gifyu.com/images/bbQa6.png",
        title: "Paintello Paint Vinyl Silk Emulsion - Brilliant White  10KG",
        price: 2000.00
    }
     
 
];

function seedfurniteur(){
    furniteur.remove({}, err => {
        if(err) console.log(err);
        furniteurs.forEach(seed => {
            furniteur.create(seed, (err, furniteur) => {
                if(err) console.log(err);
                furniteur.save();
            });
        });
    });
}

module.exports = seedfurniteur;
