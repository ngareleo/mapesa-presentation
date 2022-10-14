const express = require('express')
const router = express.Router()
const Axios = require('axios').default
const asyncHandler = require('express-async-handler')

router.get(
  '/get-data',
  asyncHandler(async (req, res) => {
    //will deal with data required by the application
    //dashboard data => https://finance.leongari/get-data?dType=dashboard
    if (req.isAuthenticated()) {
      let dataReq = req.query.dType
      console.log(dataReq)
      if (dataReq == 'dashboard') {
        const url = `http://127.0.0.1:5000/dash?uuid=${req.session.passport.user}`
        const response = await Axios.get(url)
        return res.json(response.data)
      } else if (dataReq == 'figure1') {
        //data for the bar chart
        const url = `http://127.0.0.1:5000/figure1?uuid=${req.session.passport.user}`
        const response = await Axios.get(url)
        return res.json(response.data)
      }
      return res.json({ message: 'Wrong request' })
    } else {
      return res.json({ message: 'Wrong request', error: 901 })
    }
  }),
)

module.exports = router
