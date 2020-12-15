var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PostSchema = new Schema ({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  org: {
    type: Schema.Types.ObjectId,
    required: true
  }
})

module.exports = mongoose.model('Post', PostSchema);
