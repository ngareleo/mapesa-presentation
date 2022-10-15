const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    const userDevice = req.query.type === "app" ? true : false;

    if (!user) return res.json({ authenticate: -1 }); // look for a better way => Security-flag

    req.logIn(user, (err) => {
      if (err) return next(err);
      if (userDevice) return res.json({ authenticate: 1 });
      return res.redirect("/");
    });
  })(req, res, next);
});

module.exports = router;
