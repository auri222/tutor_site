const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClassSchema = new Schema({
    name: {
        type: String
    },
    code: {
        type: String
    },
    subjects: [{
      type: Schema.Types.ObjectId
    }],
})

module.exports = mongoose.model('classes', ClassSchema)