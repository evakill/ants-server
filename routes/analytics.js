var express = require('express')
var router = express.Router()
const Metric = require('../models/Metric.js')

// get all metrics
router.get('/', async (req, res, next) => {
    const metrics = await Metric.find({})
    res.send(metrics)
})

module.exports = router
