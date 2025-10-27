const express = require('express');
const router = express.Router();

// API routes will be added here
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Paintello Pro API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
