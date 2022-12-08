const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'accounts'
    },
    sender: {
        type: String
    },
    type: {
        type: String,
        enum: ['COURSE', 'COMMENT', 'SYSTEM']
    },
    message: {type: String},
    isRead: {
        type: Boolean
    },
    typeID: {
        type: Schema.Types.ObjectId
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now
    }
})

module.exports = mongoose.model('notifications', NotificationSchema)