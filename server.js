const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// MongoDB Connection with fixed URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://paintellocontact_db_user:nOqgkEfw3ZeCQZXk@paintello-pro.kxlmuok.mongodb.net/paintello-pro?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected successfully to Paintello Pro database');
})
.catch(err => {
  console.log('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Session configuration with proper MongoStore
app.use(session({
  secret: process.env.SESSION_SECRET || 'paintello-pro-super-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60, // 14 days
    autoRemove: 'native'
  }),
  cookie: {
    secure: false, // set to true in production with HTTPS
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
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
  req.session.messages = []; // Clear messages after displaying
  next();
});

// Import routes
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client');
const painterRoutes = require('./routes/painter');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

// Use routes
app.use('/auth', authRoutes);
app.use('/client', clientRoutes);
app.use('/painter', painterRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// Public routes
app.get('/', (req, res) => {
  res.render('shared/home', { 
    title: 'Paintello Pro - Find Professional Painters in Algeria',
    featuredPainters: [],
    wilayas: require('./utils/wilayas')
  });
});

app.get('/painters', async (req, res) => {
  try {
    const Painter = require('./models/Painter');
    const painters = await Painter.find({ availability: true })
      .populate('user', 'name email phone')
      .limit(6);
    
    res.render('client/search-painters', { 
      title: 'Find Professional Painters',
      painters: painters,
      wilayas: require('./utils/wilayas'),
      query: req.query
    });
  } catch (error) {
    console.error('Error fetching painters:', error);
    res.render('client/search-painters', { 
      title: 'Find Professional Painters',
      painters: [],
      wilayas: require('./utils/wilayas'),
      query: req.query
    });
  }
});

app.get('/about', (req, res) => {
  res.render('shared/about', { 
    title: 'About Paintello Pro',
    wilayas: require('./utils/wilayas')
  });
});

app.get('/contact', (req, res) => {
  res.render('shared/contact', { 
    title: 'Contact Us - Paintello Pro',
    wilayas: require('./utils/wilayas')
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.stack);
  res.status(500).render('shared/error', { 
    title: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('shared/404', { 
    title: 'Page Not Found',
    wilayas: require('./utils/wilayas')
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🎨 Paintello Pro Server started successfully!`);
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log(`🏢 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ Database: MongoDB Atlas - Paintello Pro`);
});
