var mongoose = require('mongoose')
var Schema = mongoose.Schema

var MetricSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }

})

module.exports = mongoose.model('Metric', MetricSchema)
