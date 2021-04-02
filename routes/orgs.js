const express = require('express')
const router = express.Router()
const Org = require('../models/Org.js')
const Post = require('../models/Post.js')
const User = require('../models/User.js')
const Metric = require('../models/Metric.js')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const groupBy = require('lodash/groupBy')
const toPairs = require('lodash/toPairs')
const sortBy = require('lodash/sortBy')
const find = require('lodash/find')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-uploads',
        format: 'jpg',
    },
})

const parser = multer({ storage: storage })

// get all orgs
router.get('/', async (req, res, next) => {
    try {
        const org = await Org.find({})
        res.send({ data: org })
    } catch (err) {
        return next({ status: 500, message: 'Error getting all orgs' })
    }
})

// get 5 newest orgs
router.get('/recent', async (req, res, next) => {
    try {
        const orgs = await Org.find().sort({ _id: '-1' }).limit(5)
        res.send({ orgs })
    } catch (err) {
        return next({ status: 500, message: 'Error getting recent orgs' })
    }
})

// get 5 orgs with most activity
router.get('/trending', async (req, res, next) => {
    try {
        const tenDays = new Date()
        tenDays.setDate(tenDays.getDate() - 10)
        const metrics = await Metric.find({
            action: { $in: ['post', 'follow', 'like'] },
            timestamp: { $gte: tenDays },
        }).populate('postid')
        const orgGroups = groupBy(metrics, (m) =>
            m.postid ? m.postid.org : m.orgid
        )
        const orgs = []
        for (const [orgid, activity] of toPairs(orgGroups)) {
            if (orgid && orgid !== 'undefined') {
                let org = await Org.findById(orgid)
                org = Object.assign({ activity: activity.length }, org._doc)
                orgs.push(org)
            }
        }
        orgs.sort((a, b) => b.activity - a.activity)
        res.send({ orgs: orgs.slice(0, 5) })
    } catch (err) {
        console.log(err)
        return next({ status: 500, message: 'Error getting trending orgs' })
    }
})

// get recommended orgs for the user
router.get('/recommended/:userid', async (req, res, next) => {
    const { userid } = req.params
    let user,
        orgs = []
    try {
        user = await User.findById(userid).populate('following').exec()
        let commonUsers = {}
        for (const org of user.following) {
            let followers = await User.find({})
                .elemMatch('following', { $eq: org })
                .populate('following')
                .exec()
            for (let f of followers) {
                if (f._id == userid) continue
                if (commonUsers[f._id]) {
                    commonUsers[f._id][0] += 1
                } else {
                    commonUsers[f._id] = [1, f]
                }
            }
        }
        const rankedOrgs = {}
        toPairs(commonUsers).forEach(([, [rank, u]]) => {
            for (let org of u.following) {
                if (
                    find(
                        user.following,
                        (o) => String(o._id) == String(org._id)
                    )
                )
                    continue
                if (rankedOrgs[org._id]) {
                    rankedOrgs[org._id][0] += rank
                } else {
                    rankedOrgs[org._id] = [rank, org]
                }
            }
        })
        const sortedOrgs = sortBy(toPairs(rankedOrgs), ([, [rank]]) => rank)
        orgs = sortedOrgs.map(([, [, org]]) => org).slice(0, 5)
    } catch (err) {
        console.log(err)
        return next({ status: 500, message: 'Error getting recommended orgs' })
    }
    res.send({ orgs })
})

// get org object from id param
router.get('/:id', async (req, res, next) => {
    try {
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
        const {
            name,
            description,
            image,
            link,
            interests,
            locations,
        } = req.body
        let org = await Org.findById(req.params.id)
        if (!org) return next({ status: 404, message: 'Org not found' })
        if (interests) org.interests = interests
        if (locations) org.locations = locations
        if (name) org.name = name
        if (description) org.description = description
        if (image) org.image = image
        if (link) org.link = link
        org = await org.save()
        res.send({ org })
    } catch (err) {
        return next({ status: 500, message: 'Error updating org profile' })
    }
})

// upload image
router.post('/img/:id', parser.single('image'), async (req, res, next) => {
    try {
        const org = await Org.findOneAndUpdate(
            { _id: req.params.id },
            { image: req.file.path },
            { new: true }
        )
        if (!org) {
            return next({ status: 404, message: 'User not found.' })
        }
        res.send({ org })
    } catch (err) {
        return next({ status: 500, message: 'Internal Error.' })
    }
})

// create post
router.post('/post', async (req, res, next) => {
    try {
        const {
            orgid,
            title,
            description,
            type,
            location,
            information,
            volunteerInformation,
            link,
            startDate,
            endDate,
            allDay,
        } = req.body
        const org = await Org.findById(orgid)
        if (!org) next({ status: 404, err: 'Organization not found' })
        let newPost = new Post({
            title,
            description,
            type,
            location,
            org: orgid,
            information,
            volunteerInformation,
            link,
            startDate,
            endDate,
            allDay,
        })
        newPost = await newPost.save()
        res.send({ post: newPost })
        let newMetric = new Metric({
            userid: orgid,
            timestamp: new Date(),
            action: 'post',
            postid: newPost._id,
        })
        newMetric.save()
    } catch (err) {
        return next({ status: 500, message: 'Error creating post' })
    }
})

// create post
router.post('/edit/:id', async (req, res, next) => {
    try {
        const {
            title,
            description,
            location,
            type,
            orgid,
            information,
            volunteerInformation,
            link,
            startDate,
            endDate,
            allDay,
        } = req.body
        let org = await Org.findById(orgid)
        let post = await Post.findById(req.params.id)
        if (!post) return next({ status: 404, message: 'Post not found' })
        if (!org) next({ status: 404, err: 'Organization not found' })
        if (title) post.title = title
        if (description) post.description = description
        if (link) post.link = link
        if (type) post.type = type
        if (location) post.location = location
        if (information) post.information = information
        if (volunteerInformation)
            post.volunteerInformation = volunteerInformation
        if (startDate) post.startDate = startDate
        if (endDate) post.endDate = endDate
        if (allDay) post.allDay = allDay

        post = await post.save()
        res.send({ post: post })
    } catch (err) {
        return next({ status: 500, message: 'Error updating this post' })
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
