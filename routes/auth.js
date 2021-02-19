var express = require('express')
var router = express.Router()
var User = require('../models/User.js')
var Org = require('../models/Org.js')
const Metric = require('../models/Metric.js')
const bcrypt = require('bcrypt')
const saltRounds = 10

router.post('/login', async (req, res, next) => {
    const { username, password, userType } = req.body

    const account =
        userType == 'user'
            ? await User.findOne({ username })
            : await Org.findOne({ username })
    if (!account) return next({ status: 403, message: 'Incorrect username' })
    return bcrypt.compare(password, account.password, function (err, result) {
        if (!result) return next({ status: 403, message: 'Incorrect password' })
        let newMetric = new Metric({
            userid: account._id,
            timestamp: new Date(),
            action: 'login'
        })
        newMetric.save()
        return res.send({ account })
    })
})

router.post('/signup', async (req, res, next) => {
    const { userType, username, password, name } = req.body
    const account =
        userType == 'user'
            ? await User.findOne({ username })
            : await Org.findOne({ username })
    if (account) return next({ status: 403, message: 'Username is taken' })

    return bcrypt.hash(password, saltRounds, async (err, hash) => {
        let newAccount =
            userType == 'user'
                ? new User({
                      username,
                      password: hash,
                  })
                : new Org({
                      username,
                      password: hash,
                      name
                  })
        newAccount = await newAccount.save()
        let newMetric = new Metric({
            userid: newAccount._id,
            timestamp: new Date(),
            action: 'signup'
        })
        newMetric.save()
        return res.send({ account: newAccount })
    })
})

module.exports = router
