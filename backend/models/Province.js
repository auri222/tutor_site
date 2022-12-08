const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProvinceSchema = new Schema({
    name: {
        type: String
    },
    slug: {
        type: String
    },
    type: {
        type: String
    },
    name_with_type: {
        type: String
    },
    code: {
        type: String
    }
})

module.exports = mongoose.model('province', ProvinceSchema)