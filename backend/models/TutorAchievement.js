const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TutorAchievementSchema = new Schema({
    achievement_name: {
        type: String,
        required: true
    },
    achievement_accomplished_date: {
        type: Date
    },
    achievement_from:{
        type: String
    },
    achievement_image:{
        type: String
    },
    createdAt:{
        type: Date,
        immutable: true,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    tutor:{
        type: Schema.Types.ObjectId,
        ref: 'tutors'
    }
})

module.exports = mongoose.model('tutor_achievements', TutorAchievementSchema)