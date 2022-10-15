const express = require("express");
const router = express.Router();
const tester = require("../utils/transactions.util");
const Transactions = require("../models/transactions.model");

router.get("/upload", (req, res, next) => {
  if (req.isAuthenticated()) {
    const query = {
      user_id: req.session.passport.user,
    };
    const resultsOrder = {
      message_id: -1,
    };
    Transactions.findOne(query)
      .sort(resultsOrder)
      .limit(1)
      .then((result) => {
        if (result != null && result != undefined) {
          return res.json({ message: "Okay", limit: result.message_id });
        } else {
          return res.json({ message: "Okay", limit: 0 });
        }
      })
      .catch((err) => {
        return res.json({ message: "Failure", errorMessage: err });
      });
  } else {
    req.session.redirect = "/upload";
    return res.redirect("/login");
  }
});

router.post("/upload", (req, res, next) => {
  if (req.isAuthenticated()) {
    const obj = Object.assign({}, req.body);
    const data = Object.values(obj);

    //we feed a message and it's ID and create an instance of RegexDigest class
    //The instance returns an object with the respective
    //Should we create a single transaction schema or many schemas depending on transaction type
    let loopSize = data.length / 2;
    for (let i = 0; i <= loopSize; i++) {
      var msg = data[i * 2],
        _id = data[i * 2 + 1];
      if (msg != null && msg != undefined) {
        tester(msg, _id, req.session.passport.user);
      }
    }

    //feed the messages to a Regex Digest Machine
    return res.json({ message: "Success" });
  } else {
    return res.json({ message: "Unauthenticated" });
  }
});

module.exports = router;
