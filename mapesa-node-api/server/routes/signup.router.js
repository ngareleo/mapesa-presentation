const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const UserModel = require("../models/user.model");

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  const salt = crypto.randomBytes(16).toString("hex");
  const computedHash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");

  let newUser = new UserModel({
    username: username,
    hash: computedHash,
    salt: salt,
  });
  newUser.save().catch((err) => {
    console.error(err);
  });

  res.redirect("/login");
});

module.exports = router;
