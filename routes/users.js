var express = require('express')
var router = express.Router()
var User = require('../models/User.js')
const Metric = require('../models/Metric.js')

// get user object from id param
router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return next({ status: 404, message: 'User not found' })
        res.send({ account: user })
    } catch (err) {
        console.log('ERROR:', err)
        return next({ status: 500, message: 'Error getting user' })
    }
})

// update profile
router.post('/update/:id', async (req, res, next) => {
    try {
        const { interests, locations } = req.body
        let user = await User.findById(req.params.id)
        if (!user) return next({ status: 404, message: 'User not found' })
        user.interests = interests
        user.locations = locations
        user = await user.save()
        res.send({ user })
    } catch (err) {
        return next({ status: 500, message: 'Error updating user profile' })
    }
})

//follow org
router.post('/followOrg', async (req, res, next) => {
    const { username, orgID } = req.body
    try {
        let user = await User.findOne({ username: username })
        if (!user.following.includes(orgID)) {
            user.following.push(orgID)
            user = await User.findOneAndUpdate(
                { username: username },
                { $set: { following: user.following } }
            )
        }
        let newMetric = new Metric({
            userid: user._id,
            timestamp: new Date(),
            action: 'follow',
            orgid: orgID,
        })
        newMetric.save()
        return res.send({ account: user })
    } catch (err) {
        return next({ status: 500, message: 'Error following org' })
    }
})

//unfollow org
router.post('/unfollowOrg', async (req, res, next) => {
    const { username, orgID } = req.body

    try {
        const user = await User.findOne({ username: username })
        if (user.following.includes(orgID)) {
            user.following.splice(user.following.indexOf(orgID), 1)
            user = await User.findOneAndUpdate(
                { username: username },
                { $set: { following: user.following } }
            )
        }
        let newMetric = new Metric({
            userid: user._id,
            timestamp: new Date(),
            action: 'unfollow',
            orgid: orgID,
        })
        newMetric.save()
        return res.send({ account: user })
    } catch (err) {
        return next({ status: 500, message: 'Error unfollowing org' })
    }
})

//getIsFollowed

module.exports = router
