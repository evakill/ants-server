var mongoose = require('mongoose')
var Schema = mongoose.Schema

var MetricSchema = new Schema({
    userid: {
        type: String,
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
        type: String,
        required: false,
    },
    orgid: {
        type: String,
        required: false,
    },
})

module.exports = mongoose.model('Metric', MetricSchema)
