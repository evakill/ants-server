const express = require('express')
const router = express.Router()
const Org = require('../models/Org.js')
const Post = require('../models/Post.js')
const User = require('../models/User.js')
const Metric = require('../models/Metric.js')


// get all orgs
router.get('/', async (req, res, next) => {
    try {
        const org = await Org.find({})
        res.send({ data: org })
    } catch (err) {
        return next({ status: 500, message: 'Error getting all orgs' })
    }
})

// get org object from id param
router.get('/:id', async (req, res, next) => {
    try {
        console.log('ID here: ' + req.params.id)
        const org = await Org.findById(req.params.id)
        if (!org) next({ status: 404, err: 'Organization not found' })
        res.send({ account: org })
    } catch (err) {
        return next({ status: 500, message: 'Error getting org by id' })
    }
})

// update profile
router.post('/update/:id', async (req, res, next) => {
    try {
        const { interests, locations } = req.body
        let org = await Org.findById(req.params.id)
        if (!org) return next({ status: 404, message: 'Org not found' })
        org.interests = interests
        org.locations = locations
        org = await org.save()
        res.send({ org })
    } catch (err) {
        return next({ status: 500, message: 'Error updating org profile' })
    }
})

// create post
router.post('/post', async (req, res, next) => {
    try {
        const { orgid, title, description, type, location, information, link, startDate, endDate, allDay } = req.body
        const org = await Org.findById(orgid)
        if (!org) next({ status: 404, err: 'Organization not found' })
        let newPost = new Post({
            title,
            description,
            type,
            location,
            org: orgid,
            information, 
            link, 
            startDate,
            endDate, 
            allDay
        })
        newPost = await newPost.save();
        const time = new Date();
        const metricType = "post";
        let newMetric = new Metric({
            username: "test user id",
            timetsamp: time,
            type: metricType
        });
        newMetric = await newMetric.save();
        res.send({ post: newPost });
    } catch (err) {
        return next({ status: 500, message: 'Error creating post' })
    }
})

//get followed orgs
router.get('/followed/:username', async (req, res, next) => {
    //get user's followed list of ids
    const userParam = req.params.username
    try {
        const user = await User.findOne({ username: userParam })
        const followedList = user.following

        try {
            //get orgs
            const org = await Org.find({})
            //filter orgs by ones user follows
            var orgs = org.filter(function (o) {
                return followedList.includes(o._id)
            })
            res.send({ data: orgs })
        } catch (err) {
            return next({ status: 500, message: 'Error getting org first' })
        }
    } catch (err) {
        return next({ status: 500, message: 'Error getting org second' })
    }
})

//return whether an org is followed by a user or not
router.get('/isfollowed/:username', async (req, res, next) => {
    //get user's followed list of ids
    const userParam = req.params.username
    try {
        const user = await User.findOne({ username: userParam })
        connsole.log(user)
        const followedList = user.following

        try {
            //get orgs
            const org = await Org.find({})
            //filter orgs by ones user follows
            var orgs = org.filter(function (o) {
                return followedList.includes(o._id)
            })
            res.send({ data: orgs })
        } catch (err) {
            return next({ status: 500, message: 'Error getting org first' })
        }
    } catch (err) {
        return next({ status: 500, message: 'Error getting org second' })
    }
})

module.exports = router
