const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TutorSchema = new Schema({
    tutor_name: {
        type: String,
        required: true
    },
    tutor_title: {
        type: String
    },
    tutor_occupation: {
        type: String,
        required: true
    },
    tutor_workplace_name: {
        type: String
    },
    tutor_workplace_address: {
        type: String
    },
    tutor_profile_image: {
        type: String,
        required: true
    },
    tutor_CCCD_image: [String],
    tutor_classes: [String],
    tutor_subjects: [String],
    tutor_schedule: [String],
    account: {
        type: Schema.Types.ObjectId,
        ref: 'accounts'
    },
    createdAt:{
        type: Date,
        immutable: true,
        default: Date.now
    },
    UpdatedAt:{
        type: Date
    }
})

module.exports = mongoose.model('tutors', TutorSchema)