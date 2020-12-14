var express = require('express')
var router = express.Router()
var Org = require('../models/Org.js')

// get org object from id param
router.get('/:id', async (req, res, next) => {
    try {
        const org = await Org.findById(req.params.id)
        if (!org) next({ status: 404, err: 'Organization not found'})
        res.send({ account: org })
    } catch (err) {
        return next({ status: 500, message: 'Error getting org' })
    }
})

router.get('/', async (req, res, next) => {
    try {
        const org = await Org.find({});
        // console.log(org);
        // if (!org) next({ status: 404, err: 'Organization not found'})
        res.send({ data: org })
    } catch (err) {
        console.log("error!");
        return next({ status: 500, message: 'Error getting org' })
    }
})


module.exports = router
