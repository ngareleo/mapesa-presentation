const express = require("express");
const router = express.Router();
const Transactions = require("../models/transactions.model");
const Axios = require("axios").default;

router.get("/test", (req, res, next) => {
  //if user is not authenticated we foward them to login then later to the requested url
  if (req.isAuthenticated()) {
    //send the credentials
    let user_id = req.session.passport.user;
    let url = `http://127.0.0.1:5000/${user_id}`;
    Axios.get(url)
      .then((response) => {
        return res.json(response.data);
      })
      .catch((err) => {
        console.error(err);
        return res.send(err);
      });
  } else {
    req.session.redirect = "/test";
    res.redirect("/login");
  }
});

module.exports = router;
