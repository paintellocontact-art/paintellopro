const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://paintellocontact_db_user:nOqgkEfw3ZeCQZXk@paintello-pro.kxlmuok.mongodb.net/PAINTELLO-PRO?retryWrites=true&w=majority';

console.log('🔗 Connecting to MongoDB...');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected successfully to PAINTELLO-PRO database');
    return true;
  } catch (err) {
    console.log('❌ MongoDB connection error:', err.message);
    return false;
  }
};

// Initialize DB connection
let dbConnected = false;
connectDB().then(connected => {
  dbConnected = connected;
});

// Session configuration (memory store for now)
app.use(session({
  secret: process.env.SESSION_SECRET || 'paintello-pro-super-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 14 * 24 * 60 * 60 * 1000
  }
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Make user data available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.painter = req.session.painter || null;
  res.locals.messages = req.session.messages || [];
  req.session.messages = [];
  next();
});

// Load routes
try {
  app.use('/auth', require('./routes/auth'));
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.log('❌ Auth routes failed:', error.message);
}

try {
  app.use('/client', require('./routes/client'));
  console.log('✅ Client routes loaded');
} catch (error) {
  console.log('❌ Client routes failed:', error.message);
}

try {
  app.use('/painter', require('./routes/painter'));
  console.log('✅ Painter routes loaded');
} catch (error) {
  console.log('❌ Painter routes failed:', error.message);
}

try {
  app.use('/admin', require('./routes/admin'));
  console.log('✅ Admin routes loaded');
} catch (error) {
  console.log('❌ Admin routes failed:', error.message);
}

try {
  app.use('/api', require('./routes/api'));
  console.log('✅ API routes loaded');
} catch (error) {
  console.log('❌ API routes failed:', error.message);
}

// Public routes
app.get('/', (req, res) => {
  res.render('shared/home', { 
    title: 'Paintello Pro - Find Professional Painters in Algeria',
    featuredPainters: [],
    wilayas: require('./utils/wilayas')
  });
});

app.get('/painters', (req, res) => {
  res.render('client/search-painters', { 
    title: 'Find Professional Painters',
    painters: [],
    wilayas: require('./utils/wilayas'),
    query: req.query
  });
});

app.get('/about', (req, res) => {
  res.render('shared/about', { 
    title: 'About Paintello Pro'
  });
});

app.get('/contact', (req, res) => {
  res.render('shared/contact', { 
    title: 'Contact Us - Paintello Pro'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Paintello Pro is running! 🎨',
    version: '1.0.0',
    database: dbConnected ? '✅ Connected' : '❌ Disconnected'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.message);
  res.status(500).render('shared/error', { 
    title: 'Server Error',
    error: 'Something went wrong! Please try again later.'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('shared/404', { 
    title: 'Page Not Found'
  });
});

// Only start server if this file is run directly (not when required by bin/www)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎨 Paintello Pro Server started successfully!`);
    console.log(`📍 Running on: http://0.0.0.0:${PORT}`);
    console.log(`🏢 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`);
  });
}

// Export app for bin/www
module.exports = app;
