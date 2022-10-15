module.exports = (req, res, next) => {
  let requested = req.session.redirect;
  if (requested != undefined) {
    if (req.isAuthenticated()) {
      delete req.session.redirect;
      res.redirect(requested);
    }
    next();
  } else {
    next();
  }
};
