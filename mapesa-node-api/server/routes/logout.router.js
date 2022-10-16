const express = require("express");
const router = express.Router();

// handle this on the web-app side
router.get("/logout", (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout();
    res.redirect("/login");
  } else {
    res.json({ message: "User not authenticated" });
  }
});

module.exports = router;
