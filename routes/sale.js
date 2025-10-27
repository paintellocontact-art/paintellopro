var express = require('express')
var router = express.Router()

if (process.env.NODE_ENV !== 'production') {
    /* setting up enviroment variables */
    require('dotenv').config({path: '.env'});
    }
var Cart = require("../models/cart");
var electrical = require('../models/electrical');
var furniteur = require('../models/furniteur');
var rug = require('../models/rug');
var cuisin = require('../models/cuisin');
var curtain = require('../models/curtain');
var soft = require('../models/soft');
var bedding = require('../models/bedding');
var decor = require('../models/decor');
var station = require('../models/station');
var clean = require('../models/clean');
var header = require('../models/header');







router.get("/electrical", function(req, res){
    electrical.find({}, function(err, electricals){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/electrical", {electricals: electricals,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-electrical/:id", function(req, res){
    var electricalId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    electrical.findById(electricalId, function(err, electrical){
        if(err){
            return res.redirect("/electrical");
        }
        cart.add(electrical, electrical.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/electrical");
    });
});

router.get("/furniteur", function(req, res){
    furniteur.find({}, function(err, furniteurs){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/furniteur", {furniteurs: furniteurs,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-furniteur/:id", function(req, res){
    var furniteurId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    furniteur.findById(furniteurId, function(err, furniteur){
        if(err){
            return res.redirect("/furniteur");
        }
        cart.add(furniteur, furniteur.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/furniteur");
    });
});



router.get("/rug", function(req, res){
    rug.find({}, function(err, rugs){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/rug", {rugs: rugs,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-rug/:id", function(req, res){
    var rugId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    rug.findById(rugId, function(err, rug){
        if(err){
            return res.redirect("/rug");
        }
        cart.add(rug, rug.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/rug");
    });
});


router.get("/cuisin", function(req, res){
    cuisin.find({}, function(err, cuisins){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/cuisin", {cuisins: cuisins,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-cuisin/:id", function(req, res){
    var cuisinId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    rug.findById(cuisinId, function(err, cuisin){
        if(err){
            return res.redirect("/cuisin");
        }
        cart.add(cuisin, cuisin.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/cuisin");
    });
});

router.get("/curtain", function(req, res){
    curtain.find({}, function(err, curtains){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/curtain", {curtains: curtains,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-curtain/:id", function(req, res){
    var curtainId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    curtain.findById(curtainId, function(err, curtain){
        if(err){
            return res.redirect("/curtain");
        }
        cart.add(curtain, curtain.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/curtain");
    });
});

router.get("/decor", function(req, res){
    decor.find({}, function(err, decors){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/decor", {decors: decors,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-decor/:id", function(req, res){
    var decorId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    decor.findById(decorId, function(err, decor){
        if(err){
            return res.redirect("/decor");
        }
        cart.add(decor, decor.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/decor");
    });
});

router.get("/bedding", function(req, res){
    bedding.find({}, function(err, beddings){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/bedding", {beddings: beddings,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-bedding/:id", function(req, res){
    var beddingId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    bedding.findById(beddingId, function(err, bedding){
        if(err){
            return res.redirect("/bedding");
        }
        cart.add(bedding, bedding.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/bedding");
    });
});

router.get("/soft", function(req, res){
    soft.find({}, function(err, softs){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/soft", {softs: softs,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-soft/:id", function(req, res){
    var softId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    soft.findById(softId, function(err, soft){
        if(err){
            return res.redirect("/soft");
        }
        cart.add(soft, soft.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/soft");
    });
});

router.get("/station", function(req, res){
    station.find({}, function(err, stations){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/station", {stations: stations,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-station/:id", function(req, res){
    var stationId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    station.findById(stationId, function(err, station){
        if(err){
            return res.redirect("/station");
        }
        cart.add(station, station.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/station");
    });
});

router.get("/clean", function(req, res){
    clean.find({}, function(err, cleans){
    header.find({}, function(err, headers){
        if(err){
            console.log(err);
        }
        else{
            res.render("sale/clean", {cleans: cleans,headers:headers});
        }
    });
});
});

router.get("/add-to-cart-clean/:id", function(req, res){
    var cleanId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    clean.findById(cleanId, function(err, clean){
        if(err){
            return res.redirect("/clean");
        }
        cart.add(clean, clean.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/clean");
    });
});

module.exports = router