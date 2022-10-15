const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const User = require("../models/user.model");

const validatePassword = (salt, hash, password) => {
  const temp = crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
  return temp === hash;
};

module.exports = () => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          console.error("Validate error");
          return done(err);
        }
        if (!user) {
          console.error("User not found");
          return done(null, false, { message: "User not found" });
        }
        if (!validatePassword(user.salt, user.hash, password)) {
          console.error("Password incorrect");
          return done(null, false, { message: "Invalid Password" });
        }
        return done(null, user);
      });
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });

  passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
};
