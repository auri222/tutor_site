const mongoose = require('mongoose')
const schema = mongoose.Schema

const AccountSchema = new schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    CCCD: {
        type: String,
        maxLength: 12,
        required: true
    },
    address: {
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
    email:{
        type: String,
        required: true
    },
    phone_number:{
        type: String,
        maxLength: 10,
        required: true
    },
    createdAt:{
        type: Date,
        immutable: true,
        default: Date.now
    },
    updatedAt:{
        type: Date
    },
    isVerify:{
        type: Boolean,
        required: true
    },
    isActive:{
        type: Boolean,
        required: true
    },
    isAdmin:{
        type: Boolean,
        required: true
    },
    isLock:{
        type: Boolean
    },
    OTP:{
        type: String,
        required: true
    },
    accountType:{
        type: String,
        enum: ['ADMIN', 'TUTOR', 'USER'] 
    },
    token:{
        type: String
    }
})

module.exports = mongoose.model('accounts', AccountSchema)