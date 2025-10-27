var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

const middleware = require('../middleware');

const Cart = require('../models/cart');
const Order = require('../models/order');
var header = require('../models/header');

// protect routes using csrf
var csrfProtection = csrf();
router.use(csrfProtection);

// go to user profile
router.get('/profile', middleware.isLoggedIn, function(req, res, next) {
  header.find({}, function(err, headers){
  Order.find({user: req.user}, function(err, orders) {
    if (err) {
      return res.write('error');
    }
    let cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', {orders: orders , headers:headers});
  });
});
});

router.get('/logout', middleware.isLoggedIn, function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/user/signup');
  });
});


router.use('/', middleware.isNotLoggedIn, function(req, res, next) {
  next();
})

// sign up logic
router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages });
});

router.post('/signup', passport.authenticate('local-signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    let oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/producthome/68589aee03d002f20190271d'); //home
  }
});

// sign in logic
router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages });
});

router.post('/signin', passport.authenticate('local-signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    let oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/producthome/68589aee03d002f20190271d'); //user/profil
  }
});

router.get('/admin', function(req, res, next) {
  res.render('user/admin', {messages: '', csrfToken: req.csrfToken()});
})

module.exports = router;
