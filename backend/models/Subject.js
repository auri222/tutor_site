const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubjectSchema = new Schema({
    name: {
        type: String
    },
    code: {
        type: String
    }
})

module.exports = mongoose.model('subjects', SubjectSchema)