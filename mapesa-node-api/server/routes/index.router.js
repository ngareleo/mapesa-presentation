const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render("index");
  } else {
    req.session.redirect = "/";
    res.redirect("/login");
  }
});

module.exports = router;
