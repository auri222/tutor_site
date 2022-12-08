const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DistrictSchema = new Schema({
    name: {
        type: String
    },
    type: {
        type: String
    },
    slug: {
        type: String
    },
    name_with_type: {
        type: String
    },
    path: {
        type: String
    },
    path_with_type: {
        type: String
    },
    code: {
        type: String
    },
    parent_code: {
        type: String
    }
})

module.exports = mongoose.model('district', DistrictSchema)