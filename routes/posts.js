var express = require('express')
var router = express.Router()
var Post = require('../models/Post.js')
var Org = require('../models/Org.js')
var User = require('../models/User.js')
const Metric = require('../models/Metric.js')

// get all posts from an org
router.get('/:orgid', async (req, res, next) => {
    const posts = await Post.find({ org: req.params.orgid }).populate('org')
    res.send({ posts })
})

//get post by post id
router.get('/post/:postid', async (req, res, next) => {
    const post = await Post.findById(req.params.postid).populate('org')
    res.send({ post })
})

// get all posts liked by a user
router.get('/liked/:userid', async (req, res, next) => {
    const user = await User.findById(req.params.userid).populate({
        path: 'liked',
        populate: { path: 'org' },
    })
    if (!user) return next({ message: 'User not found', status: 404 })
    res.send({ posts: user.liked })
})

// user likes a post
router.post('/like', async (req, res, next) => {
    const { userid, postid } = req.body
    let user = await User.findById(userid)
    if (!user) return next({ message: 'User not found', status: 404 })
    let post = await Post.findById(postid).populate('org')
    if (!post) return next({ message: 'Post not found', status: 404 })
    user.liked.push(postid)
    post.likes.push(user._id)
    user = await user.save()
    post = await post.save()
    res.send({ user, post })
    let newMetric = new Metric({
        userid: user._id,
        timestamp: new Date(),
        action: 'like',
        postid: post._id,
    })
    newMetric.save()
})

// user unlikes a post
router.post('/unlike', async (req, res, next) => {
    const { userid, postid } = req.body
    let user = await User.findById(userid)
    if (!user) return next({ message: 'User not found', status: 404 })
    let post = await Post.findById(postid).populate('org')
    if (!post) return next({ message: 'Post not found', status: 404 })
    user.liked = user.liked.filter((p) => p && String(p) !== postid)
    post.likes = post.likes.filter((u) => u && String(u) !== userid)
    user = await user.save()
    post = await post.save()
    res.send({ user, post })
    let newMetric = new Metric({
        userid: user._id,
        timestamp: new Date(),
        action: 'unlike',
        postid: post._id,
    })
    newMetric.save()
})

// delete post
router.post('/delete', async (req, res, next) => {
    try {
        const { orgid, postid } = req.body
        const post = await Post.findById(postid)
        if (!post) next({ status: 404, err: 'Post not found' })
        Post.deleteOne({ "_id": postid }, function (err) {
            if(err) console.log(err);
            console.log("Successful deletion");
          })
          res.send({ "success" : true })
    } catch (err) {
        return next({ status: 500, message: 'Error deleting post: ' + err })
    } 
})

module.exports = router
