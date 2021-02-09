var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PostSchema = new Schema({
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
        ref: 'Org',
        required: true,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
    ],
    information: {
        type: String, 
        required: false,
    },
    link: {
        type: String, 
        required: false,
    }, 
    startDate: {
        type: Date, 
        required: false,
    }, 
    endDate: {
        type: Date, 
        required: false,
    }, 
    allDay: {
        type: Boolean,
        required: false,
    }
})

module.exports = mongoose.model('Post', PostSchema)
