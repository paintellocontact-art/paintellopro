const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const Painter = require('../models/Painter');
const wilayas = require('../utils/wilayas');

// Login Page
router.get('/login', (req, res) => {
  res.render('auth/login', { 
    title: 'Login - Paintello Pro',
    oldInput: {},
    messages: req.session.messages || []
  });
});

// Login Process
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      req.session.messages = [{ type: 'danger', text: 'Please provide email and password' }];
      return res.redirect('/auth/login');
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      req.session.messages = [{ type: 'danger', text: 'Invalid email or password' }];
      return res.redirect('/auth/login');
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.session.messages = [{ type: 'danger', text: 'Invalid email or password' }];
      return res.redirect('/auth/login');
    }
    
    // Set session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };
    
    // If painter, get painter data
    if (user.role === 'painter') {
      const painter = await Painter.findOne({ user: user._id });
      if (painter) {
        req.session.painter = painter;
      }
    }
    
    // Redirect based on role
    switch(user.role) {
      case 'client':
        res.redirect('/client/dashboard');
        break;
      case 'painter':
        res.redirect('/painter/dashboard');
        break;
      case 'admin':
        res.redirect('/admin/dashboard');
        break;
      default:
        res.redirect('/');
    }
    
  } catch (error) {
    console.error('Login error:', error);
    req.session.messages = [{ type: 'danger', text: 'Server error during login' }];
    res.redirect('/auth/login');
  }
});

// Client Registration Page
router.get('/register', (req, res) => {
  res.render('auth/register', { 
    title: 'Register as Client - Paintello Pro',
    oldInput: {},
    messages: req.session.messages || []
  });
});

// Client Registration Process
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
      req.session.messages = [{ type: 'danger', text: 'All fields are required' }];
      return res.redirect('/auth/register');
    }
    
    // Basic validation
    if (password !== confirmPassword) {
      req.session.messages = [{ type: 'danger', text: 'Passwords do not match' }];
      return res.redirect('/auth/register');
    }
    
    if (password.length < 6) {
      req.session.messages = [{ type: 'danger', text: 'Password must be at least 6 characters' }];
      return res.redirect('/auth/register');
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.session.messages = [{ type: 'danger', text: 'User already exists with this email' }];
      return res.redirect('/auth/register');
    }
    
    // Create user
    const user = new User({
      name,
      email,
      phone,
      password,
      role: 'client'
    });
    
    await user.save();
    
    req.session.messages = [{ type: 'success', text: 'Registration successful! Please login.' }];
    res.redirect('/auth/login');
    
  } catch (error) {
    console.error('Registration error:', error);
    req.session.messages = [{ type: 'danger', text: 'Server error during registration' }];
    res.redirect('/auth/register');
  }
});

// Painter Registration Page
router.get('/register-painter', (req, res) => {
  res.render('auth/painter-register', { 
    title: 'Join as Painter - Paintello Pro',
    oldInput: {},
    wilayas: wilayas,
    messages: req.session.messages || []
  });
});

// Painter Registration Process - FIXED VERSION
router.post('/register-painter', async (req, res) => {
  try {
   console.log('Received painter registration data:', req.body);
console.log('Files:', req.files);

    // Check if body exists
    if (!req.body) {
      req.session.messages = [{ type: 'danger', text: 'No form data received' }];
      return res.redirect('/auth/register-painter');
    }
    
    const {
      name, email, phone, password, confirmPassword,
      experience, specialization, wilaya, wilayaNumber, address,
      pricePerSqm
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !confirmPassword || 
        !experience || !wilaya || !wilayaNumber || !address || !pricePerSqm) {
      req.session.messages = [{ type: 'danger', text: 'All fields are required' }];
      return res.redirect('/auth/register-painter');
    }

    // Basic validation
    if (password !== confirmPassword) {
      req.session.messages = [{ type: 'danger', text: 'Passwords do not match' }];
      return res.redirect('/auth/register-painter');
    }

    if (password.length < 6) {
      req.session.messages = [{ type: 'danger', text: 'Password must be at least 6 characters' }];
      return res.redirect('/auth/register-painter');
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.session.messages = [{ type: 'danger', text: 'User already exists with this email' }];
      return res.redirect('/auth/register-painter');
    }

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password,
      role: 'painter'
    });

    await user.save();

    // Handle specialization - it can be string or array
    let specializationArray = [];
    if (Array.isArray(specialization)) {
      specializationArray = specialization;
    } else if (specialization) {
      specializationArray = [specialization];
    }

    // Create painter profile
    const painter = new Painter({
      user: user._id,
      experience: parseInt(experience) || 0,
      specialization: specializationArray,
      wilaya,
      wilayaNumber: parseInt(wilayaNumber) || 0,
      address,
      pricePerSqm: parseInt(pricePerSqm) || 0,
      verification: {
        isVerified: false
      }
    });

    await painter.save();

    req.session.messages = [{ type: 'success', text: 'Application submitted! We will review your profile and contact you soon.' }];
    res.redirect('/auth/login');

  } catch (error) {
    console.error('Painter registration error:', error);
    req.session.messages = [{ type: 'danger', text: 'Server error during registration: ' + error.message }];
    res.redirect('/auth/register-painter');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
