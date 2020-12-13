var express = require('express')
var router = express.Router()
var User = require('../models/User.js')
const bcrypt = require('bcrypt')
const saltRounds = 10

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) return next({ status: 403, message: 'Incorrect username' })
    bcrypt.compare(password, user.password, function(err, result) {
        if (!result) return next({ status: 403, message: 'Incorrect password'})
        res.send({ user })
    })
})

router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user) return next({ status: 403, message: 'Username is taken'})

    bcrypt.hash(password, saltRounds, async (err, hash) => {
        console.log('in hash')
        let newUser = new User({
            username,
            password: hash
        })
        newUser = await newUser.save()
        return res.send({ user: newUser })
    })
})

module.exports = router
