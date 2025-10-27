function ensureAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  req.flash('error', 'Please log in');
  return res.redirect('/login');
}

function ensureRole(role) {
  return (req, res, next) => {
    if (req.session?.user?.role === role) return next();
    return res.status(403).send('Forbidden');
  };
}

function ensureAnyRole(roles) {
  return (req, res, next) => {
    const userRole = req.session?.user?.role;
    if (roles.includes(userRole)) return next();
    return res.status(403).send('Forbidden');
  };
}

module.exports = { ensureAuth, ensureRole, ensureAnyRole };
