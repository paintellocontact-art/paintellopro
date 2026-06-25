// routes/public.js - For public access without login
const express = require('express');
const router = express.Router();
const sendMetaCAPIEvent = require('../services/metaCapi');
const getCleanUserData = require('../utils/userData');
function generateEventId() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); }); }
const Painter = require('../models/Painter');
const Order = require('../models/Order');
const wilayas = require('../utils/wilayas');


// Public painter search page
router.get('/painters', async (req, res) => {
  try {
    const { wilaya, specialization, minRating, maxPrice, minExperience, availability, sort = 'rating' } = req.query;
    
    // Build query - only show verified and active painters
    let query = { 
      'verification.status': 'verified',
      'isActive': true
    };

    // Apply filters
    if (wilaya && wilaya !== 'all') {
      query['location.wilaya'] = wilaya;
    }

    if (specialization) {
      query['specialization'] = Array.isArray(specialization) ? { $in: specialization } : specialization;
    }

    if (minRating) {
      query['rating'] = { $gte: parseFloat(minRating) };
    }

    if (maxPrice) {
      query['pricePerSqm'] = { $lte: parseInt(maxPrice) };
    }

    if (minExperience) {
      query['experience'] = { $gte: parseInt(minExperience) };
    }

    if (availability === 'true') {
      query['availability'] = 'available';
    }

    // Build sort object
    let sortOptions = {};
    switch (sort) {
      case 'rating':
        sortOptions = { rating: -1, completedJobs: -1 };
        break;
      case 'experience':
        sortOptions = { experience: -1, rating: -1 };
        break;
      case 'price_low':
        sortOptions = { pricePerSqm: 1 };
        break;
      case 'price_high':
        sortOptions = { pricePerSqm: -1 };
        break;
      default:
        sortOptions = { rating: -1 };
    }

    const painters = await Painter.find(query)
      .select('name experience pricePerSqm specialization rating completedJobs profilePicture location portfolio verification availability')
      .sort(sortOptions);
 const userData = getCleanUserData(req);
    const pageViewId = generateEventId();
    if (userData) {
      await sendMetaCAPIEvent({
        eventName: 'PageView',
        eventId: pageViewId,
        userData,
        eventSourceUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE,
      });

      // If any filter is present, send Search
      if (wilaya || specialization || minRating || maxPrice || minExperience) {
        const searchString = [wilaya, specialization, minRating].filter(Boolean).join(' ');
        await sendMetaCAPIEvent({
          eventName: 'Search',
          eventId: generateEventId(), // separate ID
          userData,
          customData: {
            search_string: searchString,
            content_category: 'painter_search',
          },
          eventSourceUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
          testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE,
        });
      }
    }

    res.render('public/painters', {
      title: 'Find Painters',
      painters,
      wilayas,
      query: req.query,
      user: req.session.user || null,
      painter: req.session.painter || null,
      metaEventIdPageView: pageViewId,
    });
  } catch (error) {
    console.error('Public painters search error:', error);
    res.render('public/painters', {
      title: 'Find Painters - Paintello Pro',
      painters: [],
      wilayas: wilayas,
      query: {},
      error: 'Error loading painters'
    });
  }
});

// Public painter profile page
// Public painter profile page - UPDATED VERSION
// ---------- PAINTER PROFILE ----------
router.get('/painters/:id', async (req, res) => {
  try {
    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(404).render('error', {
        title: 'Painter Not Found',
        message: 'Invalid painter ID format.',
        user: req.session.user || null,
        sessionPainter: req.session.painter || null,
        painter: null,
      });
    }

    const painter = await Painter.findById(req.params.id)
      .select('name experience pricePerSqm specialization rating completedJobs profilePicture location portfolio bio verification availability teamSize businessName');

    if (!painter) {
      return res.status(404).render('error', {
        title: 'Painter Not Found',
        message: 'The painter you are looking for does not exist.',
        user: req.session.user || null,
        sessionPainter: req.session.painter || null,
        painter: null,
      });
    }

    const userData = getCleanUserData(req);
    const pageViewId = generateEventId();
    const viewContentId = generateEventId();

    if (userData) {
      await sendMetaCAPIEvent({
        eventName: 'PageView',
        eventId: pageViewId,
        userData,
        eventSourceUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE,
      });
      await sendMetaCAPIEvent({
        eventName: 'ViewContent',
        eventId: viewContentId,
        userData,
        customData: {
          content_name: painter.name,
          content_ids: [painter._id.toString()],
          content_type: 'painter_profile',
          value: painter.pricePerSqm || 0,
          currency: 'DZD',
          specialization: painter.specialization?.join(', ') || '',
          wilaya: painter.location?.wilaya || '',
        },
        eventSourceUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE,
      });
    }

    // recent jobs
    const recentJobs = await Order.find({
      'painter.id': painter._id,
      status: 'completed'
    })
    .sort({ completedAt: -1 })
    .limit(5)
    .select('serviceType budget completedAt')
    .populate('client', 'name');

    res.render('public/painter-profile', {
      title: `${painter.name} - Professional Painter - Paintello Pro`,
      painter: painter,                          // database painter
      recentJobs,
      user: req.session.user || null,
      sessionPainter: req.session.painter || null,
      metaEventIdPageView: pageViewId,
      metaEventIdView: viewContentId,
      isVerified: painter.verification.status === 'verified',
      isActive: painter.isActive,
    });
  } catch (error) {
    console.error('Profile error:', error);
    if (error.name === 'CastError') {
      return res.status(404).render('error', {
        title: 'Invalid Painter ID',
        message: 'The painter ID format is invalid.',
        user: req.session.user || null,
        sessionPainter: req.session.painter || null,
        painter: null,
      });
    }
    res.status(500).render('error', {
      title: 'Error',
      message: 'An error occurred while loading the painter profile.',
      user: req.session.user || null,
      sessionPainter: req.session.painter || null,
      painter: null,
    });
  }
});

// ---------- GUEST ORDER FORM (GET) ----------
router.get('/painters/:id/order', async (req, res) => {
  try {
    const painter = await Painter.findById(req.params.id)
      .select('name pricePerSqm specialization location profilePicture experience rating verification isActive availability');

    if (!painter) {
      req.flash('error', 'Painter not found');
      return res.redirect('/painters');
    }

    // Check availability
    if (painter.verification.status !== 'verified' || !painter.isActive) {
      req.flash('warning', 'This painter cannot accept orders right now.');
      return res.redirect(`/painters/${painter._id}`);
    }

    const userData = getCleanUserData(req);
    const pageViewId = generateEventId();
    const initiateCheckoutId = generateEventId();

    if (userData) {
      await sendMetaCAPIEvent({
        eventName: 'PageView',
        eventId: pageViewId,
        userData,
        eventSourceUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE,
      });
      await sendMetaCAPIEvent({
        eventName: 'InitiateCheckout',
        eventId: initiateCheckoutId,
        userData,
        customData: {
          content_name: `Hire ${painter.name}`,
          content_ids: [painter._id.toString()],
          content_type: 'painter_hire',
          value: painter.pricePerSqm || 0,
          currency: 'DZD',
          wilaya: painter.location?.wilaya || '',
        },
        eventSourceUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE,
      });
    }

    res.render('public/guest-order', {
      title: `Hire ${painter.name} - Paintello Pro`,
      painter: painter,                          // database painter
      wilayas,
      user: req.session.user || null,
      sessionPainter: req.session.painter || null,
      metaEventIdPageView: pageViewId,
      metaEventIdInitiateCheckout: initiateCheckoutId,
    });
  } catch (error) {
    console.error('Guest order page error:', error);
    req.flash('error', 'Error loading order page');
    res.redirect('/painters');
  }
});

// ---------- GUEST ORDER SUBMISSION (POST) ----------
router.post('/painters/:id/order', async (req, res) => {
  try {
    const {
      clientName, clientEmail, clientPhone, wilaya, address,
      serviceType, roomSize, budget, description, preferredDate
    } = req.body;

    // ---- validation ----
    if (!clientName || !clientEmail || !clientPhone || !serviceType || !roomSize || !wilaya || !address || !description) {
      req.flash('error', 'Please fill all required fields');
      return res.redirect(`/painters/${req.params.id}/order`);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      req.flash('error', 'Please enter a valid email address');
      return res.redirect(`/painters/${req.params.id}/order`);
    }
    const area = parseInt(roomSize);
    if (isNaN(area) || area < 1) {
      req.flash('error', 'Please enter a valid room size');
      return res.redirect(`/painters/${req.params.id}/order`);
    }

    const painter = await Painter.findById(req.params.id);
    if (!painter || painter.verification.status !== 'verified') {
      req.flash('error', 'Painter not available');
      return res.redirect('/painters');
    }

    const totalAmount = parseInt(budget) || painter.pricePerSqm * area;
    const commission = Math.round(totalAmount * 0.10);

    const newOrder = new Order({
      guestClient: { name: clientName, email: clientEmail, phone: clientPhone },
      painter: painter._id,
      serviceType,
      wilaya,
      address,
      area,
      description,
      budget: totalAmount,
      totalAmount,
      commission,
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      source: 'guest'
    });

    await newOrder.save();

    // ---- CAPI Lead ----
    const userData = getCleanUserData(req);
    if (userData) {
      await sendMetaCAPIEvent({
        eventName: 'Lead',
        eventId: generateEventId(),
        userData,
        customData: {
          content_name: `Order for ${painter.name}`,
          content_ids: [painter._id.toString()],
          content_type: 'painter_hire',
          value: totalAmount,
          currency: 'DZD',
          service_type: serviceType,
          wilaya: wilaya,
        },
        eventSourceUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE,
      });
    }

    console.log(`✅ Guest order created for painter ${painter.name} by ${clientName}`);
    req.flash('success', `Your order has been submitted successfully! ${painter.name} will contact you soon.`);
    res.redirect('/painters');

  } catch (error) {
    console.error('Guest order creation error:', error);
    req.flash('error', 'Error creating order: ' + error.message);
    res.redirect(`/painters/${req.params.id}/order`);
  }
});



module.exports = router;
