var express = require('express')
var router = express.Router()
var User = require('../models/User.js')


// get user object from id param
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return next({ status: 404, message: 'User not found' })
    res.send({ account: user })
  } catch (err) {
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
    const { username, orgID } = req.body;
    console.log(username + "," + orgID);
    try {
        const user = await User.findOne({username: username});
        console.log("user: " + user);
        const followedList = user.following;
        console.log("list: " + followedList);
        if (!followedList.includes(orgID)) {
            followedList.push(orgID) 
            updatedAccount = await User.findOneAndUpdate({username: username}, { $set: { following: followedList}});
            return res.send({ account: updatedAccount });
        } else {
            return res.send({account: user});
        }
    } catch (err) {
        return next({ status: 500, message: 'Error following org' })
    }
})

//unfollow org 
router.post('/unfollowOrg', async (req, res, next) => {
    const { username, orgID } = req.body;
    console.log(username + "," + orgID);

    try {
        const user = await User.findOne({username: username});
        const followedList = user.following;
        console.log(followedList);
        if (followedList.includes(orgID)) {
            console.log(followedList);
            followedList.splice(followedList.indexOf(orgID), 1);
            // followedList.filter(x => !x.equals(orgID));
            // followedList.push(orgID);

            console.log(followedList);
            updatedAccount = await User.findOneAndUpdate({username: username}, { $set: { following: followedList}});
            return res.send({ account: updatedAccount });
        } else {
            return res.send({account: user});
        }
    } catch (err) {
        return next({ status: 500, message: 'Error unfollowing org' })
    }
})

//getIsFollowed


module.exports = router
