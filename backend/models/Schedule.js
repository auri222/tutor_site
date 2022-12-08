const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ScheduleSchema = new Schema({
    name: {
        type: String
    },
    code: {
        type: String
    }
})

module.exports = mongoose.model('schedules', ScheduleSchema)