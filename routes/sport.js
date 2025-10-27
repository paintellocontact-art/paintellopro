var express = require('express')
var router = express.Router()

if (process.env.NODE_ENV !== 'production') {
    /* setting up enviroment variables */
    require('dotenv').config({path: '.env'});
    }

var scooter = require('../models/scooter');
var fitnes = require('../models/fitnes');
var travel = require('../models/travel');
var header = require('../models/header');
var Cart = require("../models/cart");





router.get("/scooter", function(req, res){
    scooter.find({}, function(err, scooters){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sport/scooter", {scooters: scooters,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-scooter/:id", function(req, res){
    var scooterId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    scooter.findById(scooterId, function(err, scooter){
        if(err){
            return res.redirect("/scooter");
        }
        cart.add(scooter, scooter.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/scooter");
    });
});

router.get("/travel", function(req, res){
    travel.find({}, function(err, travels){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sport/travel", {travels: travels,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-travel/:id", function(req, res){
    var travelId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    travel.findById(travelId, function(err, travel){
        if(err){
            return res.redirect("/travel");
        }
        cart.add(travel, travel.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/travel");
    });
});


router.get("/fitnes", function(req, res){
    fitnes.find({}, function(err, fitness){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sport/fitnes", {fitness: fitness,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-fitnes/:id", function(req, res){
    var fitnesId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    fitnes.findById(fitnesId, function(err, fitnes){
        if(err){
            return res.redirect("/fitnes");
        }
        cart.add(fitnes, fitnes.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/fitnes");
    });
});

module.exports = router
