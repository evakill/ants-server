var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema ({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
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
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: false,
    }
  ],
  liked: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: false,
    }
  ]
})

module.exports = mongoose.model('User', UserSchema);
