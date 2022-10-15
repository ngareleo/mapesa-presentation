const express = require("express");
const router = express.Router();

router.get("/failed", (req, res, next) => {
  res.render("error", {
    errorTitle: "Error",
    errorName: "Authentication Error",
    errorDetail: "Error in authentication",
  });
});

module.exports = router;
