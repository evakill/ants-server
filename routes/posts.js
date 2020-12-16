var express = require('express')
var router = express.Router()
var Post = require('../models/Post.js')
var User = require('../models/User.js')

// get all posts from an org
router.get('/:orgid', async (req, res, next) => {
  const posts = await Post.find({ org: req.params.orgid })
  res.send({ posts })
})

// get all posts liked by a user
router.get('/liked/:userid', async (req, res, next) => {
  const user = await User.findById(req.params.userid).populate('liked')
  if (!user) return next({ message: 'User not found', status: 404 })
  res.send({ posts: user.liked })
})

// user likes a post
router.post('/like', async (req, res, next) => {
  const { userid, postid } = req.body
  let user = await User.findById(userid)
  if (!user) return next({ message: 'User not found', status: 404 })
  user.liked.push(postid)
  user = await user.save()
  res.send({ user })
})

// user unlikes a post
router.post('/unlike', async (req, res, next) => {
  const { userid, postid } = req.body
  let user = await User.findById(userid)
  if (!user) return next({ message: 'User not found', status: 404 })
  user.liked = user.liked.filter(p => (p && String(p) !== postid))
  user = await user.save()
  res.send({ user })
})

module.exports = router
