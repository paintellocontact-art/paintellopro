const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Add this for production sessions
const flash = require('connect-flash');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// MongoDB Connection - Remove deprecated options
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/paintello';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Production session store with MongoDB
const sessionStore = MongoStore.create({
  mongoUrl: MONGODB_URI,
  collectionName: 'sessions',
  ttl: 14 * 24 * 60 * 60, // 14 days
  autoRemove: 'native'
});

// Session configuration for production
app.use(session({
  secret: process.env.SESSION_SECRET || 'paintello-secret-key-2024-production',
  resave: false,
  saveUninitialized: false,
  store: sessionStore, // Use MongoDB for sessions in production
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// Global variables for templates
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  res.locals.currentPainter = req.session.painter;
  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  
  // Handle multer file size errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    req.flash('error', 'File too large. Maximum size is 2MB.');
    return res.redirect('back');
  }
  
  // Handle file type errors
  if (err.message.includes('image files')) {
    req.flash('error', 'Only image files are allowed.');
    return res.redirect('back');
  }
  
  res.status(500).render('error', {
    title: 'Server Error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    error: {}
  });
});

// Cloudinary configuration check
try {
  const { cloudinary } = require('./utils/cloudinary');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  cloudinary.api.ping()
    .then(result => console.log('✅ Cloudinary connected successfully'))
    .catch(err => console.error('❌ Cloudinary connection error:', err.message));
} catch (error) {
  console.error('❌ Cloudinary configuration error:', error.message);
}

// Get port from environment (Heroku provides this)
const PORT = process.env.PORT || 3000;

// Server startup - Fix port binding issue
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`☁️ Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    console.log('Process terminated');
  });
});

module.exports = app;
