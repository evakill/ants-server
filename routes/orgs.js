const express = require('express')
const router = express.Router()
const Org = require('../models/Org.js')
const Post = require('../models/Post.js')
const User = require('../models/User.js')

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

//get followed orgs
router.get('/followed/:username', async (req, res, next) => {
    //get user's followed list of ids
    const userParam = req.params.username;
    try {
        console.log(userParam);
        const user = await User.findOne({username: userParam});
        console.log("user: " + user);
        const followedList = user.following;
        console.log(followedList);
    
        try {
            //get orgs 
            const org = await Org.find({});
            //filter orgs by ones user follows
            var orgs = org.filter(function (o) {
                return followedList.includes(o._id);
            });
            console.log("followed orgs: " + orgs);
            res.send({ data: orgs })
        } catch (err) {
            console.log("error first!");
            return next({ status: 500, message: 'Error getting org first' })
        }
    } catch (err) {
        console.log("error!");
        return next({ status: 500, message: 'Error getting org second' })
    }
})

//return whether an org is followed by a user or not
router.get('/isfollowed/:username', async (req, res, next) => {
    //get user's followed list of ids
    const userParam = req.params.username;
    try {
        console.log(userParam);
        const user = await User.findOne({username: userParam});
        connsole.log(user);
        const followedList = user.following;
        console.log(followedList);
    
        try {
            //get orgs 
            const org = await Org.find({});
            //filter orgs by ones user follows
            var orgs = org.filter(function (o) {
                return followedList.includes(o._id);
            });
            console.log("followed orgs: " + orgs);
            res.send({ data: orgs })
        } catch (err) {
            console.log("error!");
            return next({ status: 500, message: 'Error getting org first' })
        }
    } catch (err) {
        console.log("error!");
        return next({ status: 500, message: 'Error getting org second' })
    }
})



module.exports = router
