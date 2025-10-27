var mongoose  = require('mongoose')
var sale = require('../models/saleH')


mongoose.connect('mongodb+srv://Islem:cmygNChSy2L9Q4xt@paintello.cu30n.mongodb.net/paintello?retryWrites=true&w=majority' , (err)=> {
    if (err) {
        console.log(err)
    } else{
        console.log('connected to db succesfuly...')
    }
    
    })

 sales = [
    
{
    image: "https://live.staticflickr.com/65535/54484395216_e110327224.jpg",
    title: "Satiné Paint",
    href:"/sale/clean"
},
{
    image: "https://live.staticflickr.com/65535/54484751175_41c6dd91d8.jpg" ,
    title: "Vinyl Paint",
    href:"/sale/furniteur"

},
{
    image: "https://live.staticflickr.com/65535/54484598224_b88ac10983.jpg",
    title: "Onecoat Matt Paint",
    href:"/sale/rug"
},
   {
    image: "https://live.staticflickr.com/65535/54484395221_896db824f8.jpg",
    title: "My Fixature",
    href:"/sale/cuisin"
},
    {
    image: "https://live.staticflickr.com/65535/54484751190_bcae07662f.jpg",
    title: "Paintello's MAC",
    href:"/sale/coat"
},
{
    image: "https://live.staticflickr.com/65535/54485036715_df1a8141a4.jpg",
    title: "Paintello's Tile paint",
    href:"/wow"
},
    {
    image: "https://live.staticflickr.com/65535/54424106620_55363280c4_c.jpg",
    title: "Samples",
    href:"/sale/sample"
}

];

function seedsale(){
sale.deleteMany({}, err => {
    if(err) console.log(err);
    sales.forEach(seed => {
        sale.create(seed, (err, sale) => {
            if(err) console.log(err);
            sale.save();
        });
    });
});
}

module.exports = seedsale;
