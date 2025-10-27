var express = require('express')
var router = express.Router()
const User = require('../models/user');
const Project = require('../models/Project');
const { ensureAuth, ensureRole } = require('../middleware/auth');

// List painters
router.get('/', async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  let painters = await User.find({ role: 'painter', 'painterProfile.approved': true });
  if (q) painters = painters.filter(p => (p.address || '').toLowerCase().includes(q) || (p.name || '').toLowerCase().includes(q));
  res.render('painters/list', { title: 'Find painters', painters });
});

// Painter profile
router.get('/:id', async (req, res) => {
  const painter = await User.findById(req.params.id);
  if (!painter || painter.role !== 'painter') {
    req.flash('error', 'Painter not found');
    return res.redirect('/painters');
  }
  res.render('painters/profile', { title: painter.name, painter });
});

// Book this painter → requires login
router.post('/:id/book', ensureAuth, async (req, res) => {
  const painter = await User.findById(req.params.id);
  if (!painter || painter.role !== 'painter') {
    req.flash('error', 'Painter not found');
    return res.redirect('/painters');
  }

  // Stash painter in session and redirect to project creation
  req.session.chosenPainter = painter._id;
  res.redirect('/client/project/new');
});



const upload = require('../middleware/upload');



// Client projects list
router.get('/projects', ensureAuth, ensureRole('client'), async (req, res) => {
  const projects = await Project.find({ client: req.user._id }).populate('painter').sort({ updatedAt: -1 });
  res.render('client/projects', { title: 'My projects', projects });
});

// New project form
router.get('/project/new', ensureAuth, ensureRole('client'), async (req, res) => {
  let painter = null;
  if (req.session.chosenPainter) {
    painter = await User.findById(req.session.chosenPainter);
  }
  res.render('client/new', { title: 'New project', chosenPainter: painter });
});

// Create project with espace photos
router.post('/project', ensureAuth, ensureRole('client'), upload.array('beforePhotos', 6), async (req, res) => {
  try {
    let painterId = req.session.chosenPainter || req.body.painterId;
    const project = new Project({
      client: req.user._id,
      painter: painterId || undefined,
      details: {
        description: req.body.description,
        area: Number(req.body.area),
        style: req.body.style,
        address: req.body.address
      },
      pricePerM2: Number(req.body.pricePerM2),
      beforePhotos: (req.files || []).map(f => '/uploads/projects/' + f.filename),
      status: painterId ? 'matched' : 'pending'
    });
    await project.save();

    // Clear chosen painter
    req.session.chosenPainter = null;

    req.flash('success', painterId ? 'Project created and painter assigned!' : 'Project created. We’ll match a painter soon.');
    res.redirect('/client/projects');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error creating project.');
    res.redirect('/client/project/new');
  }
});





// Painter dashboard
router.get('/projects', ensureAuth, ensureRole('painter'), async (req, res) => {
  try {
    const projects = await Project.find({ painter: req.user._id }).populate('client').sort({ updatedAt: -1 });
    res.render('painter/projects', { title: 'Painter dashboard', projects });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading projects');
    res.redirect('/');
  }
});






    
module.exports = router
