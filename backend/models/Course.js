const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CourseSchema = new Schema({
    course_name: {
        type: String,
        required: true
    },
    course_classes: [String],
    course_subjects: [String],
    course_schedule: [String], 
    course_requirement:{
        type: String
    },
    course_created_at: {
        type: Date,
        default: Date.now
    },
    course_updated_at: {
        type: Date
    },
    course_time:{
        type: String
    },
    course_candidates: [
        {
            type: Schema.Types.ObjectId,
            ref: 'tutors'
        }
    ],
    course_registered_tutor: {
        registered_tutor:{
            type: Schema.Types.ObjectId,
            ref: 'tutors'
        },
        registered_date_accepted:{
            type: Date
        },
        registered_is_accepted:{
            type: Boolean
        }
    },
    course_address: {
        home_number: String,
        street: String,
        ward: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        province: {
            type: String,
            require: true
        }
    },
    course_status: {type: Number},
    course_purpose: {type: Number},
    course_number: {type: Number},
    course_code: {type: String},
    account:{
        type: Schema.Types.ObjectId,
        ref: 'accounts'
    }
})

module.exports = mongoose.model('courses', CourseSchema)