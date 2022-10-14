var express = require("express");
var router = express.Router();
var passport = require("passport");

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    let isApp = req.query.type === "app" ? true : false;

    if (!user) {
      return res.json({ authenticate: -1 });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      if (isApp) return res.json({ authenticate: 1 });
      return res.redirect("/");
    });
  })(req, res, next);
});

module.exports = router;
