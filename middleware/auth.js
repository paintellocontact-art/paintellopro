function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  req.flash('error', 'Please login first.');
  res.redirect('/login');
}
function ensureRole(role) {
  return function(req, res, next) {
    if (req.user && req.user.role === role) return next();
    req.flash('error', 'Unauthorized');
    res.redirect('/');
  };
}

module.exports = { ensureAuth, ensureRole };
