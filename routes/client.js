const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Painter = require('../models/Painter');
const wilayas = require('../utils/wilayas');

// Middleware to check if user is client
const requireClient = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'client') {
    next();
  } else {
    req.flash('error', 'Please login to access client dashboard');
    res.redirect('/auth/login');
  }
};

// Client Dashboard
router.get('/dashboard', requireClient, async (req, res) => {
  try {
    const orders = await Order.find({ client: req.session.user._id })
      .populate('painter.id', 'name email phone rating')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const stats = {
      totalOrders: await Order.countDocuments({ client: req.session.user._id }),
      activeOrders: await Order.countDocuments({ 
        client: req.session.user._id,
        status: { $in: ['pending', 'accepted', 'in_progress'] }
      }),
      completedOrders: await Order.countDocuments({ 
        client: req.session.user._id,
        status: 'completed'
      })
    };
    
    res.render('client/dashboard', {
      title: 'Client Dashboard - Paintello Pro',
      recentOrders: orders,
      stats: stats,
      user: req.session.user,
      success: req.flash('success')[0],
      error: req.flash('error')[0]
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Error loading dashboard');
    res.render('client/dashboard', {
      title: 'Client Dashboard - Paintello Pro',
      recentOrders: [],
      stats: {},
      user: req.session.user
    });
  }
});

// My Orders
router.get('/orders', requireClient, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const status = req.query.status || 'all';
    const limit = 10;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = { client: req.session.user._id };
    if (status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('painter.id', 'name email phone rating specialization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);
    
    res.render('client/orders', {
      title: 'My Orders - Paintello Pro',
      orders: orders,
      status: status,
      currentPage: page,
      totalPages: totalPages,
      user: req.session.user
    });
  } catch (error) {
    console.error('Orders error:', error);
    req.flash('error', 'Error loading orders');
    res.render('client/orders', {
      title: 'My Orders - Paintello Pro',
      orders: [],
      status: 'all',
      currentPage: 1,
      totalPages: 1,
      user: req.session.user
    });
  }
});

// Order Details
router.get('/orders/:id', requireClient, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      client: req.session.user._id 
    }).populate('painter.id', 'name email phone rating experience specialization');
    
    if (!order) {
      req.flash('error', 'Order not found');
      return res.redirect('/client/orders');
    }
    
    res.render('client/order-details', {
      title: 'Order Details - Paintello Pro',
      order: order,
      user: req.session.user
    });
  } catch (error) {
    console.error('Order details error:', error);
    req.flash('error', 'Error loading order details');
    res.redirect('/client/orders');
  }
});

// Create Order Page
router.get('/create-order', requireClient, async (req, res) => {
  try {
    const painterId = req.query.painter;
    let painter = null;
    
    if (painterId) {
      painter = await Painter.findById(painterId);
    }
    
    res.render('client/create-order', {
      title: 'Create Order - Paintello Pro',
      painter: painter,
      wilayas: wilayas,
      user: req.session.user,
      oldInput: req.flash('oldInput')[0] || {},
      error: req.flash('error')[0]
    });
  } catch (error) {
    console.error('Create order page error:', error);
    req.flash('error', 'Error loading order creation page');
    res.render('client/create-order', {
      title: 'Create Order - Paintello Pro',
      painter: null,
      wilayas: wilayas,
      user: req.session.user
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

    // Store form data in case of error
    const formData = {
      painterId,
      serviceType,
      wilaya,
      address,
      area,
      description,
      scheduledDate
    };

    // Validation
    if (!painterId) {
      req.flash('error', 'Please select a painter');
      req.flash('oldInput', formData);
      return res.redirect('/client/create-order');
    }

    if (!area || area < 1) {
      req.flash('error', 'Please enter a valid area');
      req.flash('oldInput', formData);
      return res.redirect('/client/create-order');
    }

    const painter = await Painter.findById(painterId);
    if (!painter) {
      req.flash('error', 'Painter not found');
      req.flash('oldInput', formData);
      return res.redirect('/client/create-order');
    }

    // Calculate budget
    const budget = parseInt(area) * painter.pricePerSqm;
    const order = new Order({
      client: {
        id: req.session.user._id,
        name: req.session.user.name,
        email: req.session.user.email,
        phone: req.session.user.phone
      },
      painter: {
        id: painter._id,
        name: painter.name,
        email: painter.email,
        phone: painter.phone
      },
      serviceType: serviceType || 'painting',
      location: {
        wilaya: wilaya,
        address: address
      },
      area: parseInt(area),
      description: description,
      budget: budget,
      status: 'pending',
      scheduledDate: scheduledDate || null
    });

    await order.save();

    console.log(`✅ New order created by ${req.session.user.name} for painter ${painter.name}`);
    req.flash('success', 'Order created successfully! The painter will review your request.');
    res.redirect('/client/orders');
    
  } catch (error) {
    console.error('Create order error:', error);
    req.flash('error', 'Error creating order: ' + error.message);
    req.flash('oldInput', req.body);
    res.redirect('/client/create-order');
  }
});

// Cancel Order
router.post('/orders/:id/cancel', requireClient, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      'client.id': req.session.user._id 
    });

    if (!order) {
      req.flash('error', 'Order not found');
      return res.redirect('/client/orders');
    }

    // Only allow cancellation for pending or accepted orders
    if (!['pending', 'accepted'].includes(order.status)) {
      req.flash('error', 'Cannot cancel order in current status');
      return res.redirect('/client/orders');
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelledBy = 'client';
    await order.save();

    req.flash('success', 'Order cancelled successfully');
    res.redirect('/client/orders');
  } catch (error) {
    console.error('Cancel order error:', error);
    req.flash('error', 'Error cancelling order');
    res.redirect('/client/orders');
  }
});

// Find Painters Page
router.get('/find-painters', requireClient, async (req, res) => {
  try {
    const { wilaya, specialization, minRating, page = 1 } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { 
      'verification.status': 'verified',
      isActive: true 
    };

    if (wilaya && wilaya !== 'all') {
      query['location.wilaya'] = wilaya;
    }

    if (specialization && specialization !== 'all') {
      query.specialization = specialization;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    const painters = await Painter.find(query)
      .select('name email phone experience pricePerSqm specialization rating location portfolio')
      .sort({ rating: -1, experience: -1 })
      .skip(skip)
      .limit(limit);

    const totalPainters = await Painter.countDocuments(query);
    const totalPages = Math.ceil(totalPainters / limit);

    res.render('client/find-painters', {
      title: 'Find Painters - Paintello Pro',
      painters: painters,
      wilayas: wilayas,
      filters: { wilaya, specialization, minRating },
      currentPage: parseInt(page),
      totalPages: totalPages,
      user: req.session.user
    });
  } catch (error) {
    console.error('Find painters error:', error);
    req.flash('error', 'Error loading painters');
    res.render('client/find-painters', {
      title: 'Find Painters - Paintello Pro',
      painters: [],
      wilayas: wilayas,
      filters: {},
      currentPage: 1,
      totalPages: 1,
      user: req.session.user
    });
  }
});

// Painter Profile View
router.get('/painter/:id', requireClient, async (req, res) => {
  try {
    const painter = await Painter.findOne({
      _id: req.params.id,
      'verification.status': 'verified',
      isActive: true
    });

    if (!painter) {
      req.flash('error', 'Painter not found or not available');
      return res.redirect('/client/find-painters');
    }

    // Get painter's completed orders count
    const completedOrders = await Order.countDocuments({
      'painter.id': painter._id,
      status: 'completed'
    });

    res.render('client/painter-profile', {
      title: `${painter.name} - Paintello Pro`,
      painter: painter,
      completedOrders: completedOrders,
      user: req.session.user
    });
  } catch (error) {
    console.error('Painter profile error:', error);
    req.flash('error', 'Error loading painter profile');
    res.redirect('/client/find-painters');
  }
});

// Client Profile
router.get('/profile', requireClient, async (req, res) => {
  try {
    res.render('client/profile', {
      title: 'My Profile - Paintello Pro',
      user: req.session.user,
      success: req.flash('success')[0],
      error: req.flash('error')[0]
    });
  } catch (error) {
    console.error('Profile error:', error);
    req.flash('error', 'Error loading profile');
    res.redirect('/client/dashboard');
  }
});

// Update Client Profile
router.post('/profile', requireClient, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    // Update session user data
    req.session.user = {
      ...req.session.user,
      name: name,
      phone: phone
    };

    // Here you would update the user in database
    // const user = await User.findByIdAndUpdate(...)

    req.flash('success', 'Profile updated successfully');
    res.redirect('/client/profile');
  } catch (error) {
    console.error('Profile update error:', error);
    req.flash('error', 'Error updating profile');
    res.redirect('/client/profile');
  }
});

module.exports = router;
