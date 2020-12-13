var mongoose = require('mongoose')
var Schema = mongoose.Schema

var OrgSchema = new Schema ({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  interests: {
    type: [String],
    required: false,
  },
  locations: {
    type: [String],
    required: false,
  },
})

module.exports = mongoose.model('Org', OrgSchema)