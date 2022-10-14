var express = require('express')
var router = express.Router()
const crypto = require('crypto')
const UserModel = require('../models/user')

// GET
router.get('/signup', (req, res, next) => {
  res.render('signup')
})

// POST
router.post('/signup', (req, res, next) => {
  let username = req.body.username
  let password = req.body.password

  s = crypto.randomBytes(16).toString('hex')
  h = crypto.pbkdf2Sync(password, s, 10000, 512, 'sha512').toString('hex')

  let newUser = new UserModel({
    username: username,
    hash: h,
    salt: s,
  })
  newUser.save().catch((err) => {
    console.error(err)
  })
  res.redirect('/login')
})

module.exports = router
