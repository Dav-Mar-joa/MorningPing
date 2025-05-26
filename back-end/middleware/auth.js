 module.exports = isAuthenticated;
  function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      return next(); 
    } else {
      return res.redirect('/Login'); 
    }
  }
  
  module.exports = isAuthenticated;
  