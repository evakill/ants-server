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


module.exports = router
