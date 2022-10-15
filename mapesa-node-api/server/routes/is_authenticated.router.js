const express = require('express')
const router = express.Router()

router.get('/is-authenticated', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true })
    return
  }
  res.json({ authenticated: false })
})

module.exports = router
