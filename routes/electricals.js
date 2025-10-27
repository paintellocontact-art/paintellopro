var express = require('express')
var router = express.Router()

if (process.env.NODE_ENV !== 'production') {
    /* setting up enviroment variables */
    require('dotenv').config({path: '.env'});
    }

var cart = require("../models/cart");
var blander = require('../models/blander');
var cleaning = require('../models/cleaning');

var food = require('../models/food');
var gaming = require('../models/gaming');
var garden = require('../models/garden');
var health = require('../models/health');
var iron = require('../models/iron');
var micro = require('../models/micro');
var mobile = require('../models/mobile');
var vacuum = require('../models/vacuum');
var header = require('../models/header');



router.get("/blander", function(req, res){
    blander.find({}, function(err, blanders){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/blander", {blanders: blanders,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-blander/:id", function(req, res){
    var blanderId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    blander.findById(blanderId, function(err, blander){
        if(err){
            return res.redirect("/blander");
        }
        cart.add(blander, blander.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/blander");
    });
});

router.get("/cleaning", function(req, res){
    cleaning.find({}, function(err, cleanings){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/cleaning", {cleanings: cleanings,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-cleaning/:id", function(req, res){
    var cleaningId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    cleaning.findById(cleaningId, function(err, cleaning){
        if(err){
            return res.redirect("/cleaning");
        }
        cart.add(cleaning, cleaning.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/cleaning");
    });
});


router.get("/food", function(req, res){
    food.find({}, function(err, foods){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/food", {foods: foods,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-food/:id", function(req, res){
    var foodId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    food.findById(foodId, function(err, food){
        if(err){
            return res.redirect("/food");
        }
        cart.add(food, food.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/food");
    });
});

router.get("/gaming", function(req, res){
    gaming.find({}, function(err, gamings){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/gaming", {gamings: gamings,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-gaming/:id", function(req, res){
    var gamingId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    gaming.findById(gamingId, function(err, gaming){
        if(err){
            return res.redirect("/gaming");
        }
        cart.add(gaming, gaming.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/gaming");
    });
});

router.get("/garden", function(req, res){
    garden.find({}, function(err, gardens){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/rug", {gardens: gardens,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-garden/:id", function(req, res){
    var gardenId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    garden.findById(gardenId, function(err, garden){
        if(err){
            return res.redirect("/garden");
        }
        cart.add(garden, garden.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/garden");
    });
});

router.get("/health", function(req, res){
    health.find({}, function(err, healths){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/health", {healths: healths,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-health/:id", function(req, res){
    var healthId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    health.findById(healthId, function(err, health){
        if(err){
            return res.redirect("/health");
        }
        cart.add(health, health.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/health");
    });

});
router.get("/iron", function(req, res){
    iron.find({}, function(err, irons){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/iron", {irons: irons,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-iron/:id", function(req, res){
    var ironId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    iron.findById(ironId, function(err, iron){
        if(err){
            return res.redirect("/iron");
        }
        cart.add(iron, iron.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/iron");
    });
});

router.get("/micro", function(req, res){
    micro.find({}, function(err, micros){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/micro", {micros: micros,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-micro/:id", function(req, res){
    var microId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    micro.findById(microId, function(err, micro){
        if(err){
            return res.redirect("/micro");
        }
        cart.add(micro, micro.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/micro");
    });
});

router.get("/mobile", function(req, res){
    mobile.find({}, function(err, mobiles){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/mobile", {mobiles: mobiles,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-mobile/:id", function(req, res){
    var mobileId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    mobile.findById(mobileId, function(err, mobile){
        if(err){
            return res.redirect("/mobile");
        }
        cart.add(mobile, mobile.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/mobile");
    });
});

router.get("/vacuum", function(req, res){
    vacuum.find({}, function(err, vacuums){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/rug", {vacuums: vacuums,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-vacuum/:id", function(req, res){
    var vacuumId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    vacuum.findById(vacuumId, function(err, vacuum){
        if(err){
            return res.redirect("/vacuum");
        }
        cart.add(vacuum, vacuum.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/vacuum");
    });
});



module.exports = router
