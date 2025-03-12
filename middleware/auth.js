// Authentication middleware
export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash('error', 'Please login to access this page');
  res.redirect('/login');
};

// Admin middleware
export const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return next();
  }
  req.flash('error', 'You do not have permission to access this page');
  res.redirect('/');
};
