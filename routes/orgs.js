const express = require('express')
const router = express.Router()
const Org = require('../models/Org.js')
const Post = require('../models/Post.js')

// get all orgs
router.get('/', async (req, res, next) => {
    try {
        const org = await Org.find({});
        res.send({ data: org })
    } catch (err) {
        return next({ status: 500, message: 'Error getting all orgs' })
    }
})

// get org object from id param
router.get('/:id', async (req, res, next) => {
    try {
        const org = await Org.findById(req.params.id)
        if (!org) next({ status: 404, err: 'Organization not found'})
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
      const { orgid, title, description, type, location } = req.body
        const org = await Org.findById(orgid)
        if (!org) next({ status: 404, err: 'Organization not found'})
        let newPost = new Post({
          title,
          description,
          type,
          location,
          org: orgid
        })
        newPost = await newPost.save()
        res.send({ post: newPost })
    } catch (err) {
        return next({ status: 500, message: 'Error creating post' })
    }
})


module.exports = router
