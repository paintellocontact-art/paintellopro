const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Painter = require('../models/Painter');

// Middleware to check if user is client
const requireClient = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'client') {
    next();
  } else {
    res.redirect('/auth/login');
  }
};

// Client Dashboard
router.get('/dashboard', requireClient, async (req, res) => {
  try {
    const orders = await Order.find({ client: req.session.user.id })
      .populate('painter')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const stats = {
      totalOrders: await Order.countDocuments({ client: req.session.user.id }),
      activeOrders: await Order.countDocuments({ 
        client: req.session.user.id,
        status: { $in: ['pending', 'accepted', 'in_progress'] }
      }),
      completedOrders: await Order.countDocuments({ 
        client: req.session.user.id,
        status: 'completed'
      })
    };
    
    res.render('client/dashboard', {
      title: 'Client Dashboard - Paintello Pro',
      recentOrders: orders,
      stats: stats
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('client/dashboard', {
      title: 'Client Dashboard - Paintello Pro',
      recentOrders: [],
      stats: {}
    });
  }
});

// My Orders
router.get('/orders', requireClient, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ client: req.session.user.id })
      .populate('painter')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalOrders = await Order.countDocuments({ client: req.session.user.id });
    const totalPages = Math.ceil(totalOrders / limit);
    
    res.render('client/my-orders', {
      title: 'My Orders - Paintello Pro',
      orders: orders,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    console.error('Orders error:', error);
    res.render('client/my-orders', {
      title: 'My Orders - Paintello Pro',
      orders: [],
      currentPage: 1,
      totalPages: 1
    });
  }
});

// Create Order Page
router.get('/create-order', requireClient, async (req, res) => {
  try {
    const painterId = req.query.painter;
    let painter = null;
    
    if (painterId) {
      painter = await Painter.findById(painterId).populate('user');
    }
    
    res.render('client/create-order', {
      title: 'Create Order - Paintello Pro',
      painter: painter,
      wilayas: require('../utils/wilayas')
    });
  } catch (error) {
    console.error('Create order page error:', error);
    res.render('client/create-order', {
      title: 'Create Order - Paintello Pro',
      painter: null,
      wilayas: require('../utils/wilayas')
    });
  }
});

// Create Order Process
router.post('/create-order', requireClient, async (req, res) => {
  try {
    const {
      painterId,
      serviceType,
      wilaya,
      address,
      area,
      description,
      scheduledDate
    } = req.body;
    
    const painter = await Painter.findById(painterId);
    if (!painter) {
      req.session.messages = [{ type: 'danger', text: 'Painter not found' }];
      return res.redirect('/client/create-order');
    }
    
    const budget = area * painter.pricePerSqm;
    const commission = budget * painter.commissionRate;
    const totalAmount = budget + commission;
    
    const order = new Order({
      client: req.session.user.id,
      painter: painterId,
      serviceType,
      wilaya,
      address,
      area: parseInt(area),
      description,
      budget,
      commission,
      totalAmount,
      scheduledDate: scheduledDate || null
    });
    
    await order.save();
    
    req.session.messages = [{ type: 'success', text: 'Order created successfully! The painter will review your request.' }];
    res.redirect('/client/orders');
    
  } catch (error) {
    console.error('Create order error:', error);
    req.session.messages = [{ type: 'danger', text: 'Error creating order' }];
    res.redirect('/client/create-order');
  }
});

module.exports = router;
