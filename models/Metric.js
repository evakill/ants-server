var mongoose = require('mongoose')
var Schema = mongoose.Schema

var MetricSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    postid: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: false,
    },
    orgid: {
        type: Schema.Types.ObjectId,
        ref: 'Org',
        required: false,
    },
})

module.exports = mongoose.model('Metric', MetricSchema)
