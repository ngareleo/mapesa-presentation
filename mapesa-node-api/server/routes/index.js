var express = require('express')
var router = express.Router()
var passport = require('passport')

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    //we need to get the actual data
    res.render('index')
  } else {
    req.session.redirect = '/'
    res.redirect('/login')
  }
})

module.exports = router
