var express = require('express')
var router = express.Router()
var Org = require('../models/Org.js')
var User = require('../models/User.js')

// get org object from id param
router.get('/:id', async (req, res, next) => {
    try {
        const org = await Org.findById(req.params.id)
        if (!org) next({ status: 404, err: 'Organization not found'})
        res.send({ account: org })
    } catch (err) {
        return next({ status: 500, message: 'Error getting org' })
    }
})

router.get('/', async (req, res, next) => {
    try {
        const org = await Org.find({});
        // console.log(org);
        // if (!org) next({ status: 404, err: 'Organization not found'})
        res.send({ data: org })
    } catch (err) {
        console.log("error!");
        return next({ status: 500, message: 'Error getting org' })
    }
})

//get followed orgs
router.get('/followed/:username', async (req, res, next) => {
    //get user's followed list of ids
    const userParam = req.params.username;
    try {
        console.log(userParam);
        const user = await User.findOne({username: userParam});
        const followedList = user.followedOrgs;
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
