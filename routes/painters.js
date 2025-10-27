const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerPainter,
  getPainters,
  getPainterDashboard,
  updatePainter
} = require('../controllers/painterController');

router.post('/register', protect, registerPainter);
router.get('/', getPainters);
router.get('/dashboard', protect, getPainterDashboard);
router.put('/profile', protect, updatePainter);

module.exports = router;
