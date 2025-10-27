const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');
const painterRoutes = require('./painters');
const orderRoutes = require('./orders');
const productRoutes = require('./products');

// Use routes
router.use('/auth', authRoutes);
router.use('/painters', painterRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);

module.exports = router;
    

