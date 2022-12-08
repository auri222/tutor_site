const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
    review_detail: {
        type: String,
        required: true
    },
    reviewAt: {
        type: Date,
        default: Date.now
    },
    account:{
        type: Schema.Types.ObjectId,
        ref: 'accounts'
    },
    tutor:{
        type: Schema.Types.ObjectId,
        ref: 'tutors'
    }
})

module.exports = mongoose.Model('reviews', ReviewSchema)