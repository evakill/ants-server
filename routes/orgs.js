var express = require('express')
var router = express.Router()
var Org = require('../models/Org.js')

// get org object from id param
router.get('/:id', function(req, res, next) {
    const org = await Org.findById(req.params.id)
    if (!org) next({ err: 'Organization not found'})
    res.send({ org })
})

module.exports = router
