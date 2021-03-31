var express = require('express')
var router = express.Router()
const Metric = require('../models/Metric.js')
const Org = require('../models/Org.js')
const Post = require('../models/Post.js')
const find = require('lodash/find')

// get all metrics
router.get('/', async (req, res, next) => {
    const metrics = await Metric.find()
    res.send(metrics)
})

// get all metrics for an org
router.get('/:orgid', async (req, res, next) => {
    const { orgid } = req.params
    const org = await Org.findById(orgid)
    const posts = await Post.find({ org: orgid })
    const postids = posts.map((p) => p._id)
    const follows = await Metric.find({ action: 'follow', orgid })
    let likes = await Metric.find({ action: 'like' })
        .where('postid')
        .in(postids)
    const metrics = [
        ...follows,
        ...likes.map((l) => {
            const obj = {
                title: find(posts, (p) => (p._id = l.postid)).title,
            }
            Object.assign(obj, l._doc)
            return obj
        }),
    ]
    res.send(metrics)
})

module.exports = router
